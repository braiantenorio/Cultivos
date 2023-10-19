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

	@Transactional
	public Cultivar add(Cultivar atributo) {
		return repository.save(atributo);
	}

	@Transactional
	public Cultivar update(Cultivar lote) {
		return repository.save(lote);
	}

	public void delete(long id) {
		repository.deleteById(id);
	}

	public List<Cultivar> findAllCultivares(boolean filtered) {
		return repository.findAllCultivares(filtered);
	}

	public List<Cultivar> findLotesActivosByCultivar(long id) {
		return repository.findLotesActivosByCultivar(id);
	}

}