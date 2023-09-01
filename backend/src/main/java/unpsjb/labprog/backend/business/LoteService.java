package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Lote;

@Service
public class LoteService {

	@Autowired
	LoteRepository repository;

	//TODO: Mejorar
	public List<Lote> findAll() {
		List<Lote> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public Lote findById(long id) {
		return repository.findById(id).orElse(null);
	}

	@Transactional
	public Lote update(Lote lote) {
		return repository.save(lote);
	}

	@Transactional
	public Lote add(Lote lote) {
		return repository.save(lote);
	}

}
