package unpsjb.labprog.backend.presenter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.model.ERole;
import unpsjb.labprog.backend.model.Role;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.payload.request.LoginRequest;
import unpsjb.labprog.backend.payload.request.SignupRequest;
import unpsjb.labprog.backend.payload.response.JwtResponse;
import unpsjb.labprog.backend.payload.response.MessageResponse;
import unpsjb.labprog.backend.business.RoleRepository;
import unpsjb.labprog.backend.business.UsuarioRepository;
import unpsjb.labprog.backend.jwt.JwtUtils;
import unpsjb.labprog.backend.business.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/auth")
public class AuthPresenter {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UsuarioRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity
        .ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles, userDetails.getNombre(), userDetails.getApellido()));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Nombre de usuario ya esta en uso!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email ya esta en uso!"));
    }

    // Create new user's account
    Usuario user = new Usuario(signUpRequest.getUsername(), signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()), signUpRequest.getNombre(), signUpRequest.getApellido());

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "admin":
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);

          break;
        case "mod":
          Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(modRole);

          break;
        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente!"));
  }
}