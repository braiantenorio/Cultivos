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
		// completarProcesoProgramado(id,proceso.getTipoProceso().getNombre());?

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

	public ProcesoProgramado completarProcesoProgramado(String id, String proceso) {

		ProcesoProgramado pp = procesoProgramadoService.findProcesoProgramado(id, proceso);
		if (pp != null) {
			pp.setCompletado(true);
			procesoProgramadoService.update(pp);
			if (pp.getCantidad() != 1) {
				ProcesoProgramado ppNew = new ProcesoProgramado();
				ppNew.setCantidad(pp.getCantidad() - 1);
				ppNew.setFrecuencia(pp.getFrecuencia());
				ppNew.setCompletado(false);
				ppNew.setProceso(pp.getProceso());
				ppNew.setFechaARealizar(pp.getFechaARealizar().plusDays(pp.getFrecuencia()));
				ppNew = procesoProgramadoService.add(ppNew);
				Lote lote = loteService.findByCode(id);
				Agenda agenda = lote.getAgenda();
				agenda.addprocesoProgramado(ppNew);
				agendaService.update(agenda);
				return ppNew;
			}

		}
		return null;
	}

}
