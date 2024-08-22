package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.model.ListaDeAtributos;
import unpsjb.labprog.backend.business.ListaDeAtributosService;
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

@RestController
@RequestMapping("listaDeAtributos")
public class ListaDeAtributosPresenter {

	@Autowired
	ListaDeAtributosService service;

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public ResponseEntity<Object> findById(@PathVariable("id") int id) {
		ListaDeAtributos listaOrNull = service.findById(id);
		return (listaOrNull != null) ? Response.ok(listaOrNull) : Response.notFound();
	}

	@GetMapping
	public ResponseEntity<Object> findAll(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(value = "term", required = false) String term) {
		return Response.ok(service.findByPage(service.findAll(term), page, size));
	}

	@RequestMapping(value = "/search", method = RequestMethod.GET)
	public ResponseEntity<Object> search() {
		return Response.ok(service.findAll());
	}

	@PostMapping
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Object> crear(@RequestBody ListaDeAtributos ListaDeAtributos) {

		return Response.ok(
				service.add(ListaDeAtributos),
				"ListaDeAtributos creado correctamente");
	}

	@PutMapping
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Object> update(@RequestBody ListaDeAtributos ListaDeAtributos) {
		return Response.ok(service.update(ListaDeAtributos), "ListaDeAtributos actualizado correctamente");
	}

	@DeleteMapping(value = "/delete/{id}")
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	public void delete(@PathVariable("id") Long id) {
		service.delete(id);
	}

	@RequestMapping(value = "/nombre/{code}", method = RequestMethod.GET)
	public ResponseEntity<Object> findByNombre(@PathVariable("code") String code) {
		ListaDeAtributos loteOrNull = service.findByNombre(code);
		return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
	}
}
