package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Valor;
import unpsjb.labprog.backend.model.Valor;

@Service
public class ValorService {

	@Autowired
	ValorRepository repository;

	//TODO: Mejorar
	public List<Valor> findAll() {
		List<Valor> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}


    public Valor findById(long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Valor update(Valor valor) {
        return repository.save(valor);
    }

    @Transactional
    public Valor add(Valor valor) {
        return repository.save(valor);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void processValues(Long id) {
        repository.processValues(id);
    }

}