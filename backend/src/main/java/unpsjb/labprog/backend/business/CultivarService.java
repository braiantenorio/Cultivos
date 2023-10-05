package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Cultivar;

@Service
public class CultivarService {

	@Autowired
	CultivarRepository repository;

	// TODO: Mejorar
	public List<Cultivar> findAll() {
		List<Cultivar> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
	public Cultivar findById(long id) {
		return repository.findById(id).orElse(null);
	}

}