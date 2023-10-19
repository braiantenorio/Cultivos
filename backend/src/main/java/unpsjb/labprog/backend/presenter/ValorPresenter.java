package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ValorService;
import unpsjb.labprog.backend.model.Valor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("valores")

public class ValorPresenter {

	@Autowired
	ValorService service;

	@GetMapping
	public ResponseEntity<Object> findAll() {
		return Response.ok(service.findAll());
	}

	@GetMapping(value = "/id/{id}")
	public ResponseEntity<Object> findById(@PathVariable("id") int id) {
		Valor valorOrNull = service.findById(id);
		return (valorOrNull != null) ? Response.ok(valorOrNull) : Response.notFound();
	}

	@PostMapping
	public ResponseEntity<Object> crear(@RequestBody Valor valor) {

		return Response.ok(
				service.add(valor),
				"Valor creado correctamente");
	}

	@PutMapping
	public ResponseEntity<Object> update(@RequestBody Valor valor) {
		return Response.ok(service.update(valor), "Lote actualizado correctamente");
	}

	@DeleteMapping(value = "/delete/{id}")
	public void delete(@PathVariable("id") Long id) {
		service.delete(id);
	}

	@GetMapping(value = "/procesos/{id}")
	public ResponseEntity<Object> processValues(@PathVariable("id") int id) {
		Valor valorOrNull = service.findById(id);
		return (valorOrNull != null) ? Response.ok(valorOrNull) : Response.notFound();
	}
}