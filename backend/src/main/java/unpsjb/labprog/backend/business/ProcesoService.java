package unpsjb.labprog.backend.business;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import unpsjb.labprog.backend.model.Usuario;
import jakarta.persistence.EntityManager;

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

	@Autowired
	private EntityManager entityManager;

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
		proceso.setUsuario(obtenerUsuario()); // no lo probe pero deberia funcionar, cualquier cosa lo comentas y vez si
												// sigue dando error xd

		return repository.save(proceso);
	}

	@Transactional
	public Proceso add(Proceso proceso, String codigo, Boolean indep) {
		Lote lote = loteService.findByCode(codigo);
		proceso.setUsuario(obtenerUsuario());
		lote.addProceso(proceso);

		try {
			// loteService.update(lote);
			loteRepository.save(lote); // ahora este para que no actualice el usuario del lote
			completarProcesoProgramado(codigo, proceso.getListaDeAtributos().getNombre(), indep);
		} catch (Exception e) {
		}
		return null; // bueno esto no viene con el id xd
	}

	public void delete(Long id) {
		Proceso proceso = findById(id);
		Usuario usuario = proceso.getUsuario();
		proceso.setDeleted(true);
		proceso = update(proceso);
		proceso.setUsuario(usuario);
		repository.save(proceso);
	}

	private ProcesoProgramado completarProcesoProgramado(String id, String proceso, Boolean indep) {

		List<ProcesoProgramado> pp = procesoProgramadoService.findProcesoProgramado(id, proceso);
		if (pp != null && !(indep)) {
			pp.get(0).setCompletado(true);
			procesoProgramadoService.update(pp.get(0));
			ProcesoProgramado pp1 = procesoProgramadoService.findProcesoProgramadoUltimo(id, proceso);
			if (pp1 != null) {
				// procesoProgramadoService.crearProcesosProgramadosCantidadIndefinida();
				pp1.setCantidad(pp1.getCantidad() - 1);
			}

		}
		return null;
	}

	public Usuario obtenerUsuario() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Usuario usuario = usuarioService.findByUsername(username);
		return usuario;
	}

	public Proceso findAllRevisions(long id) {
		AuditReader reader = AuditReaderFactory.get(entityManager);
		List<Number> revisionNumbers2 = reader.getRevisions(Proceso.class, id);
		System.out.println(revisionNumbers2.size());
		for (Number revisionNumber : revisionNumbers2) {
			Proceso entidad = reader.find(Proceso.class, id, revisionNumber);
			Date revisionDate = reader.getRevisionDate(revisionNumber);

			if (entidad.isDeleted()) {
				entidad.setFecha(revisionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
				entidad.setUsuario(usuarioService.findById(entidad.getUsuario().getId()));
				return entidad;
			}
		}

		return null;
	}

}
