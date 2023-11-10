package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ERole;
import unpsjb.labprog.backend.model.Role;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

	@Autowired
	UsuarioRepository repository;

	@Autowired
	RoleRepository roleRepository;

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

}