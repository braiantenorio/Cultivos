package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

	@Autowired
	UsuarioRepository repository;

	//TODO: Mejorar
	public List<Usuario> findAll() {
		List<Usuario> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
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


}