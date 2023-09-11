package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.ProcesoProgramado;

@Service
public class ProcesoProgramadoService {

	@Autowired
	ProcesoProgramadoRepository repository;

	//TODO: Mejorar
	public List<ProcesoProgramado> findAll() {
		List<ProcesoProgramado> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
    @Transactional
	public ProcesoProgramado add(ProcesoProgramado procesoProgramado) {
		return repository.save(procesoProgramado);
	}


}