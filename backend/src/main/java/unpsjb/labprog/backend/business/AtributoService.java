package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Atributo;

@Service
public class AtributoService {

	@Autowired
	AtributoRepository repository;

	//TODO: Mejorar
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

	public void delete(Long id){
		repository.deleteById(id);
	}
}