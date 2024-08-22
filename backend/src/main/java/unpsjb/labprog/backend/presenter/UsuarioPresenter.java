package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.UpdateProfileDTO;
import unpsjb.labprog.backend.business.ProcesoService;
import unpsjb.labprog.backend.business.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.model.Usuario;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("usuarios")
public class UsuarioPresenter {

  @Autowired
  UsuarioService service;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  ProcesoService procesoService;

  @GetMapping
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAll());
  }

  @GetMapping(value = "/board")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findAllForBoard() {
    return Response.ok(service.findAllForBoard());
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Usuario usuario = service.findById(id);
    return (usuario != null) ? Response.ok(usuario) : Response.notFound();
  }

  @PostMapping(value = "/id/{id}/role/{role}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Object> changeRole(@PathVariable("id") int id, @PathVariable("role") String role) {
    return Response.ok(service.changeUsuario(id, role));
  }

  @PostMapping("/updateProfile")
  //@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDTO request) {
    Usuario user = procesoService.obtenerUsuario();
    
    if (user == null) {
      return ResponseEntity.badRequest().body("User not found");
    }

    user.setNombre(request.getNombre());
    user.setApellido(request.getApellido());
    user.setEmail(request.getEmail());
    user.setUsername(request.getUsername());

    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
      user.setPassword(encoder.encode(request.getPassword()));
    }

    service.update(user);

    return ResponseEntity.ok("Profile updated successfully");
  }

  @GetMapping(value = "/getUser")
  //@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> getUser(@RequestParam String username) {
    return Response.ok(service.findByUsername(username));
  }

}