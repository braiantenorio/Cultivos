package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Comparator;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import jakarta.persistence.EntityManager;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.model.Categoria;
import java.util.Date;
import unpsjb.labprog.backend.DTOs.LoteRevisionDTO;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;

@Service
public class LoteService {

	@Autowired
	LoteRepository repository;

	@Autowired
	private EntityManager entityManager;

	@Autowired
	UsuarioService usuarioService;

	// TODO: Mejorar
	public List<Lote> findAll() {
		List<Lote> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public List<Lote> findAllActivos() {
		return repository.findAllActivos();
	}

	public Page<Lote> findByPage(List<Lote> clientes, int page, int size) {
		int start = page * size;
		int end = Math.min(start + size, clientes.size());
		Page<Lote> clientesPage = new PageImpl<>(clientes.subList(start, end), PageRequest.of(page, size),
				clientes.size());
		return clientesPage;
	}

	public List<Lote> findAllActivosByCategoria(Categoria categoria) {
		return repository.findAllActivosByCategoria(categoria);
	}

	public List<LoteRevisionDTO> findAllRevisions(long id) {
		AuditReader reader = AuditReaderFactory.get(entityManager);
		List<Number> revisionNumbers = reader.getRevisions(Lote.class, id);
		List<LoteRevisionDTO> revisions = new ArrayList<>();
		List<Number> revisionNumbers2 = reader.getRevisions(Proceso.class, 2052);
		System.out.println(revisionNumbers2.size());

		for (Number revisionNumber : revisionNumbers) {
			Lote entidad = reader.find(Lote.class, id, revisionNumber);

			Date revisionDate = reader.getRevisionDate(revisionNumber);
			if (entidad == null) {
				entidad = findById(id);
			}
			LoteRevisionDTO revisionDTO = new LoteRevisionDTO();
			revisionDTO.setUsuario(usuarioService.findById(entidad.getUsuario().getId()));
			entidad.setUsuario(null);
			entidad.setProcesos(null);
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
	public List<Lote> findAll(boolean isDeleted, String term, String sortField, String sortDirection) {
		Session session = entityManager.unwrap(Session.class);

		session.enableFilter("deletedLoteFilter")
				.setParameter("isDeleted", isDeleted)
				.setParameter("codigo", "%" + term + "%");

		List<Lote> products = (List<Lote>) (sortDirection.equals("asc")
				? repository.findAll(Sort.by(sortField).ascending())
				: repository.findAll(Sort.by(sortField).descending()));

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
		lote.setUsuario(obtenerUsuario());

		return repository.save(lote);
	}

	@Transactional
	public Lote add(Lote lote) {
		lote.setUsuario(obtenerUsuario());

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
		int count = repository.countLotesByCategoria(lote.getCategoria(), lote.getCultivar()) + 1;
		LocalDate fecha = LocalDate.now();
		int year = fecha.getYear() % 100;
		String codigo = lote.getCultivar().getCodigo() + "-" + lote.getCategoria().getCodigo() +
				"-" + count + "-" + year;
		return codigo;
	}

	private Usuario obtenerUsuario() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Usuario usuario = usuarioService.findByUsername(username);
		return usuario;
	}

	public List<Object[]> findLotesAndValoresByAtributos(List<Long> list, LocalDate localDate) {
		return repository.findLotesAndValoresByAtributos(list, localDate);
	}

	public List<Lote> findLotesByCategoria(Categoria categoria, LocalDate localDate) {
		return repository.findLotesByCategoria(categoria, localDate);
	}

	public List<Lote> findAllFecha(LocalDate date) {
		return repository.findAllFecha(date);
	}

	public List<Object[]> findLotesAndValoresByAtributosAndCategoria(List<Long> listaAtributos, Categoria categoria,
			LocalDate localDate) {
		return repository.findLotesAndValoresByAtributosAndCategoria(listaAtributos, categoria, localDate);
	}

	public byte[] generarContenidoPDF(Long id) throws IOException {
		Lote lote = findById(id);
		System.out.println(lote.getId());

		try (PDDocument document = new PDDocument()) {
			PDPage page = new PDPage();
			document.addPage(page);
			PDDocumentInformation info = document.getDocumentInformation();
        	info.setTitle("Inf-" + lote.getCodigo() + "-"+ LocalDate.now());

			try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
				contentStream.setFont(PDType1Font.HELVETICA_BOLD, 24);
				contentStream.beginText();
				contentStream.newLineAtOffset(215.2f, 718);
				contentStream.showText("Informe de Lote");
				contentStream.newLine();
				contentStream.newLine();
				contentStream.newLine();

				contentStream.endText();

				contentStream.beginText();
				contentStream.setFont(PDType1Font.HELVETICA, 15);
				contentStream.setLeading(30);
				contentStream.newLineAtOffset(57, 678); // 25 725
				String text1 = "Codigo: " + lote.getCodigo();
				String text2 = "Categoria: " + lote.getCategoria().getNombre();
				String text3 = "Cultivar: " + lote.getCultivar().getNombre();
				String text4 = "Cantidad: " + lote.getCantidad(); //
				String text5 = "Fecha de Creacion: " + lote.getFecha().toString();
				String estado = lote.getFechaDeBaja() == null ? "Activo": "Inactivo";
				String text6 = "Estado: " + estado;

				String text7 =lote.getLotePadre() != null? "Procedencia: " + lote.getLotePadre().getCategoria().getNombre() + " con codigo "
						+ lote.getLotePadre().getCodigo() : "Procedencia: Nuevo";

				contentStream.showText(text1);
				contentStream.newLine();
				contentStream.showText(text2);
				contentStream.newLine();
				contentStream.showText(text3);
				contentStream.newLine();
				contentStream.showText(text4);
				contentStream.newLine();
				contentStream.showText(text5);
				contentStream.newLine();
				contentStream.showText(text6);
				contentStream.newLine();
				contentStream.showText(text7);
				contentStream.newLine();

				// fecha, nombre del cultivar, fecha de siembra, cantidad, procedencia,
				contentStream.endText();
			}

			// Convierte el documento a un arreglo de bytes
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			document.save(byteArrayOutputStream);
			document.close();

			return byteArrayOutputStream.toByteArray();
		}
	}

}
