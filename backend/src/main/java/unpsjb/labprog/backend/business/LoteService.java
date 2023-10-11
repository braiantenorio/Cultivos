package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Comparator;
import org.hibernate.Session;
import org.hibernate.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import jakarta.persistence.EntityManager;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Categoria;
import java.util.Date;
import unpsjb.labprog.backend.DTOs.LoteRevisionDTO;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;

@Service
public class LoteService {

	@Autowired
	LoteRepository repository;

	@Autowired
	private EntityManager entityManager;

	// TODO: Mejorar
	public List<Lote> findAll() {
		List<Lote> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public List<Lote> findAllActivos() {
		return repository.findAllActivos();
	}

	public List<Lote> findAllActivosByCategoria(Categoria categoria) {
		return repository.findAllActivosByCategoria(categoria);
	}

	public List<LoteRevisionDTO> findAllRevisions(long id) {
		AuditReader reader = AuditReaderFactory.get(entityManager);
		List<Number> revisionNumbers = reader.getRevisions(Lote.class, id);
		List<LoteRevisionDTO> revisions = new ArrayList<>();

		for (Number revisionNumber : revisionNumbers) {
			Lote entidad = reader.find(Lote.class, id, revisionNumber);
			Date revisionDate = reader.getRevisionDate(revisionNumber);

			if (entidad == null) {
				entidad = findById(id);
			}
			// Verificar si la revisión es una eliminación (revtype = 2)
			LoteRevisionDTO revisionDTO = new LoteRevisionDTO();
			revisionDTO.setEntidad(entidad);
			revisionDTO.setRevisionDate(revisionDate);

			revisions.add(revisionDTO);
		}

		// Ordenar las revisiones por fecha de revisión de la más reciente a la más
		// antigua
		Collections.sort(revisions, Comparator.comparing(LoteRevisionDTO::getRevisionDate).reversed());

		return revisions;
	}

	// find all con filtro de lotes con softdelete
	public Iterable<Lote> findAll(boolean isDeleted, String term) {
		Session session = entityManager.unwrap(Session.class);

		session.enableFilter("deletedLoteFilter")
				.setParameter("isDeleted", isDeleted)
				.setParameter("codigo", "%" + term + "%");

		Iterable<Lote> products = repository.findAll();
		session.disableFilter("deletedLoteFilter");

		return products;
	}

	public Lote findById(long id) {
		return repository.findById(id).orElse(null);
	}

	public Lote findByCode(String code) {
		return repository.findByCode(code).orElse(null);
	}

	public int calculateTotalCantidadSublotes(long lotePadreId) {
		return repository.calculateTotalCantidadSublotes(lotePadreId);
	}

	public List<String> search(String term) {
		return repository.searchLote("%" + term + "%");
	}

	@Transactional
	public Lote update(Lote lote) {
		return repository.save(lote);
	}

	@Transactional
	public Lote add(Lote lote) {

		return repository.save(lote);
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

	public List<Lote> obtenerLotesPadres(Long loteId) {
		List<Lote> lotesPadres = new ArrayList<>();
		Lote lote = repository.findById(loteId).orElse(null);
		if (lote != null) {
			obtenerLotesPadresRecursivo(lote, lotesPadres);
		}
		return lotesPadres;
	}

	private void obtenerLotesPadresRecursivo(Lote lote, List<Lote> lotesPadres) {
		if (lote != null) {
			lotesPadres.add(lote);
			obtenerLotesPadresRecursivo(lote.getLotePadre(), lotesPadres);
		}
	}

	public String generarCodigo(Lote lote) {
		int count = repository.countLotesByCategoria(lote.getCategoria()) + 1;
		LocalDate fecha = LocalDate.now();
		int year = fecha.getYear() % 100;
		String codigo = lote.getCultivar().getCodigo() + "-" + lote.getCategoria().getCodigo() +
				"-" + count + "-" + year;
		return codigo;
	}

}
