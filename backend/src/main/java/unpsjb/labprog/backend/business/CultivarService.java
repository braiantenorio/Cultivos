package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Cultivar;
import unpsjb.labprog.backend.model.ListaDeAtributos;

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

	public Page<Cultivar> findByPage(List<Cultivar> clientes, int page, int size) {
		int start = page * size;
		int end = Math.min(start + size, clientes.size());
		Page<Cultivar> clientesPage = new PageImpl<>(clientes.subList(start, end), PageRequest.of(page, size),
				clientes.size());
		return clientesPage;
	}

}