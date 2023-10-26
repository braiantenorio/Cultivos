package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.AtributoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import unpsjb.labprog.backend.model.Atributo;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("atributos")

public class AtributoPresenter {

  @Autowired
  AtributoService service;

  @GetMapping
  public ResponseEntity<Object> findAll(@RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response.ok(service.findByPage(service.findAll(), page, size));
  }

  @RequestMapping(value = "/search", method = RequestMethod.GET)
  public ResponseEntity<Object> search() {
    return Response.ok(service.findAll());
  }

  @PostMapping
  public ResponseEntity<Object> crear(@RequestBody Atributo tipoAgenda) {

    return Response.ok(
        service.add(tipoAgenda),
        "Agenda creada correctamente");
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Atributo loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @DeleteMapping(value = "/delete/{id}")
  public void delete(@PathVariable("id") Long id) {
    service.delete(id);
  }

}