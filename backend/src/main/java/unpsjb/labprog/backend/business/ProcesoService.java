package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.ProcesoProgramado;

@Service
public class ProcesoService {

	@Autowired
	ProcesoRepository repository;

	@Autowired
	LoteService loteService;

	@Autowired
	ProcesoProgramadoService procesoProgramadoService;

	@Autowired
	AgendaService agendaService;

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
	public Proceso add(Proceso proceso, String id) {
		Lote lote = loteService.findByCode(id);
		lote.addProceso(proceso);

		try {
			loteService.update(lote);
			completarProcesoProgramado(id,proceso.getListaDeAtributos().getNombre());
		} catch (Exception e) {
			// TODO: handle exception error de recursion
		}
		return null; // bueno esto no viene con el id xd
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

	private ProcesoProgramado completarProcesoProgramado(String id, String proceso) {

	    List<ProcesoProgramado> pp = procesoProgramadoService.findProcesoProgramado(id, proceso);
		if (pp != null) {
			pp.get(0).setCompletado(true);
			procesoProgramadoService.update(pp.get(0));

		}
		return null;
	}

}
