package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unpsjb.labprog.backend.model.Categoria;

@Service
public class CategoriaService {

	@Autowired
	CategoriaRepository repository;

	// TODO: Mejorar
	public List<Categoria> findAll() {
		List<Categoria> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
	public Categoria findById(long id) {
		return repository.findById(id).orElse(null);
	}

}