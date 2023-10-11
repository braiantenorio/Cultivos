package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.TipoAgenda;

@Service
public class TipoAgendaService {

	@Autowired
	TipoAgendaRepository repository;

	// TODO: Mejorar
	public List<TipoAgenda> findAll() {
		List<TipoAgenda> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public List<TipoAgenda> findAllActivos() {

		return repository.findAllActivos();
	}

	public List<TipoAgenda> findAllCategorias(String categoria) {

		return repository.findAllCategorias(categoria);
	}

	public TipoAgenda findByCategoria(String categoria, String version) {
		return repository.findByCategoria(categoria, version).orElse(null);
	}

	@Transactional
	public TipoAgenda add(TipoAgenda agenda) {
		return repository.save(agenda);
	}

	public TipoAgenda findById(long id) {
		return repository.findById(id).orElse(null);
	}

	@Transactional
	public TipoAgenda update(TipoAgenda lote) {
		return repository.save(lote);
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

}