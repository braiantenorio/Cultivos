package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Proceso;

@Service
public class ProcesoService {

	@Autowired
	ProcesoRepository repository;

	@Autowired
	LoteService loteService;

	// TODO: Mejorar
	public List<Proceso> findAll() {
		List<Proceso> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public Proceso findById(long id) {
		return repository.findById(id).orElse(null);
	}

	@Transactional
	public Proceso update(Proceso proceso) {
		return repository.save(proceso);
	}

	@Transactional
	public Proceso add(Proceso proceso, int id) {
		Lote lote = loteService.findById(id);
		lote.addProceso(proceso);
		try {
			loteService.update(lote);
		} catch (Exception e) {
			// TODO: handle exception error de recursion
		}
		return null; // bueno esto no viene con el id xd
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

}
