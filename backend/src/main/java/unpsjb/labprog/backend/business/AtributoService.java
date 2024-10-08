package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Atributo;

@Service
public class AtributoService {

	@Autowired
	AtributoRepository repository;

	// TODO: Mejorar
	public List<Atributo> findAll() {
		List<Atributo> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	@Transactional
	public Atributo add(Atributo atributo) {
		return repository.save(atributo);
	}

	public Atributo findById(long id) {
		return repository.findById(id).orElse(null);
	}

	@Transactional
	public Atributo update(Atributo lote) {
		return repository.save(lote);
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

	public List<Atributo> findTipoDeProcesosByAtributo(long id) {
		return repository.findTipoDeProcesosByAtributo(id);
	}

	public List<Atributo> findAllCategorias(boolean filtered) {
		return repository.findAllAtributos(filtered);
	}

	public Page<Atributo> findByPage(List<Atributo> clientes, int page, int size) {
		int start = page * size;
		int end = Math.min(start + size, clientes.size());
		Page<Atributo> clientesPage = new PageImpl<>(clientes.subList(start, end), PageRequest.of(page, size),
				clientes.size());
		return clientesPage;
	}
}