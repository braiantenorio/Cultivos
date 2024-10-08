package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ProcesoService;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.DTOs.LoteCodigoDTO;

@RestController
@RequestMapping("procesos")
public class ProcesoPresenter {

	@Autowired
	ProcesoService service;

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public ResponseEntity<Object> findById(@PathVariable("id") int id) {
		Proceso loteOrNull = service.findById(id);
		return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
	}

	@GetMapping
	public ResponseEntity<Object> findAll() {
		return Response.ok(service.findAll());
	}

	@PostMapping(value = "/lote/{codigo}")
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Object> crear(@RequestBody Proceso Proceso, @PathVariable("codigo") String codigo,
			@RequestParam(value = "indep", required = false) boolean indep) {

		return Response.ok(service.add(Proceso, codigo, indep), "Proceso creado correctamente");
	}

	@PostMapping(value = "/lotes")
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Object> crear(@RequestBody LoteCodigoDTO loteCodigo) {

		for (String lote : loteCodigo.getLotesCodigos()) {
			service.add(loteCodigo.getProceso(), lote, false);
		}

		return Response.ok(loteCodigo, "Proceso creado correctamente");
	}

	@PutMapping
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Object> update(@RequestBody Proceso lote) {
		return Response.ok(service.update(lote), "Proceso actualizado correctamente");
	}

	@DeleteMapping(value = "/delete/{id}")
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public void delete(@PathVariable("id") Long id) {
		service.delete(id);
	}

	@GetMapping(value = "/audit/{id}")
	public ResponseEntity<Object> audit(@PathVariable("id") Long id) {
		return Response.ok(service.findAllRevisions(id), "Proceso actualizado correctamente");
	}
}
