package unpsjb.labprog.backend.business;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ERole;
import unpsjb.labprog.backend.model.Role;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {
	private static final long EXPIRE_TOKEN=30;

	@Value("${FRONTEND_URL}")
	private String frontend_url;

	@Autowired
	UsuarioRepository repository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	EmailServiceImpl emailService;

	@Autowired
  	PasswordEncoder encoder;

	// TODO: Mejorar
	public List<Usuario> findAll() {
		List<Usuario> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public List<Usuario> findAllForBoard() {
		List<Usuario> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		result.remove(obtenerUsuario());
		return result;
	}

	private Usuario obtenerUsuario() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Usuario usuario = findByUsername(username);
		return usuario;
	}

	@Transactional
	public Usuario add(Usuario usuario) {
		return repository.save(usuario);
	}

	@Transactional
	public Usuario update(Usuario usuario) {
		return repository.save(usuario);
	}

	public Usuario obtenerUsuarioPorEmail(String email) {
		return repository.findByEmail(email);
	}

	public Usuario findById(long id) {
		return repository.findById(id).orElse(null);
	}

	public Usuario findByUsername(String username) {
		return repository.findByUsername(username).orElse(null);
	}

	public Usuario changeUsuario(int id, String role) {
		Usuario usuario = findById(id);
		usuario.setRoles(newRoles(role));
		return repository.save(usuario);
	}

	private Set<Role> newRoles(String role) {
		Set<Role> roles = new HashSet<>();

		if ("ROLE_ADMIN".equals(role)) {
			roles.addAll((roleRepository.findAll()));
		} else if ("ROLE_MODERATOR".equals(role)) {
			roles.add(roleRepository.findByName(ERole.ROLE_USER).orElse(null));
			roles.add(roleRepository.findByName(ERole.ROLE_MODERATOR).orElse(null));
		} else if ("ROLE_USER".equals(role)) {
			roles.add(roleRepository.findByName(ERole.ROLE_USER).orElse(null));
		}

		return roles;

	}

	 public void forgotPass(String email){
        Optional<Usuario> userOptional = Optional.ofNullable(repository.findByEmail(email));
        Usuario user=userOptional.get();
        user.setToken(generateToken());
        user.setTokenCreationDate(LocalDateTime.now());

        user=repository.save(user);

		String resetLink = frontend_url +"/reset-password?token=" + user.getToken();
        String[] recipients = {email}; // Crea un arreglo con un solo elemento

		String emailBody = "<p>Hola,</p>"
		+ "<p>Haga click <a href=\"" + resetLink + "\">aquí</a> para restablecer su contraseña.</p>"
		+ "<p>Si no solicitó este cambio, puede ignorar este correo.</p>";
		emailService.sendEmailMime(recipients, "Petición de cambio de contraseña",emailBody );
    }

    public Boolean resetPass(String token, String password){
        Optional<Usuario> userOptional= Optional.ofNullable(repository.findByToken(token));

        if(!userOptional.isPresent()){
            return false;
        }
        LocalDateTime tokenCreationDate = userOptional.get().getTokenCreationDate();

        if (isTokenExpired(tokenCreationDate)) {
            return false;
        }

        Usuario user = userOptional.get();

        user.setPassword(encoder.encode(password)); // TODO: ENCODE
        user.setToken(null);
        user.setTokenCreationDate(null);

        repository.save(user);

        return true;
    }

    private String generateToken() {
        StringBuilder token = new StringBuilder();

        return token.append(UUID.randomUUID().toString())
                .append(UUID.randomUUID().toString()).toString();
    }

    private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

        LocalDateTime now = LocalDateTime.now();
        Duration diff = Duration.between(tokenCreationDate, now);

        return diff.toMinutes() >= EXPIRE_TOKEN;
    }

}