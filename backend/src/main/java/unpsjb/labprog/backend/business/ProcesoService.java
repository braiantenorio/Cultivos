package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class ProcesoService {

	@Autowired
	ProcesoRepository repository;

	@Autowired
	LoteService loteService;

	@Autowired
	LoteRepository loteRepository;

	@Autowired
	ProcesoProgramadoService procesoProgramadoService;

	@Autowired
	AgendaService agendaService;

	@Autowired
	UsuarioService usuarioService;

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
		proceso.setUsuario(obtenerUsuario()); // no lo probe pero deberia funcionar, cualquier cosa lo comentas y vez si sigue dando error xd

		return repository.save(proceso);
	}

	@Transactional
	public Proceso add(Proceso proceso, String codigo) {
		Lote lote = loteService.findByCode(codigo);
		proceso.setUsuario(obtenerUsuario());
		lote.addProceso(proceso);

		try {
			//loteService.update(lote);
			loteRepository.save(lote); // ahora este para que no actualice el usuario del lote
			completarProcesoProgramado(codigo, proceso.getListaDeAtributos().getNombre());
		} catch (Exception e) {
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

	private Usuario obtenerUsuario() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Usuario usuario = usuarioService.findByUsername(username);
		return usuario;
	}

}
