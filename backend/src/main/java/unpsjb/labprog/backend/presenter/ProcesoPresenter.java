package unpsjb.labprog.backend.presenter;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.FileStorageService;
import unpsjb.labprog.backend.business.ProcesoService;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.Valor;
import unpsjb.labprog.backend.payload.request.ProcesoRequest;
import unpsjb.labprog.backend.payload.request.ValorRequest;
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
	public ResponseEntity<Object> crear(@RequestBody Proceso proceso, @PathVariable("codigo") String codigo) {

		for (Valor valor : proceso.getValores()) {
			System.out.println(valor.getValor());
		}
        
		return Response.ok(service.add(proceso, codigo), "Proceso creado correctamente");
	}

	@PostMapping(value = "/lotes")
	public ResponseEntity<Object> crear(@RequestBody LoteCodigoDTO loteCodigo) {

		for (String lote : loteCodigo.getLotesCodigos()) {
			service.add(loteCodigo.getProceso(), lote);
		}

		return Response.ok(loteCodigo, "Proceso creado correctamente");
	}

	@PutMapping
	public ResponseEntity<Object> update(@RequestBody Proceso lote) {
		return Response.ok(service.update(lote), "Proceso actualizado correctamente");
	}

	@DeleteMapping(value = "/delete/{id}")
	public void delete(@PathVariable("id") Long id) {
		service.delete(id);
	}
}
