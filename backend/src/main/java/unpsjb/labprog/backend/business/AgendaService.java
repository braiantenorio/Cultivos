package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Agenda;

@Service
public class AgendaService {

	@Autowired
	AgendaRepository repository;

	// TODO: Mejorar
	public List<Agenda> findAll() {
		List<Agenda> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	@Transactional
	public Agenda add(Agenda agenda) {
		return repository.save(agenda);
	}

	@Transactional
	public Agenda update(Agenda agenda) {
		return repository.save(agenda);
	}

}