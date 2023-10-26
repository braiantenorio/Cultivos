package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TipoAgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import unpsjb.labprog.backend.model.TipoAgenda;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("tipoagendas")

public class TipoAgendaPresenter {

  @Autowired
  TipoAgendaService service;

  @GetMapping
  public ResponseEntity<Object> findAll(@RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response.ok(service.findByPage(service.findAllActivos(), page, size));
  }

  @RequestMapping(value = "/search", method = RequestMethod.GET)
  public ResponseEntity<Object> search() {
    return Response.ok(service.findAll());
  }

  @PostMapping
  public ResponseEntity<Object> crear(@RequestBody TipoAgenda tipoAgenda) {
    TipoAgenda loteOrNull = service.findByCategoria(tipoAgenda.getCategoria().getNombre(), tipoAgenda.getVersion());
    if (tipoAgenda.getId() != null && loteOrNull != null) {

      if (tipoAgenda.getId().equals(loteOrNull.getId()))
        return Response.ok(
            service.add(tipoAgenda),
            "Agenda creada correctamente");
    }
    return (loteOrNull != null) ? Response.notFound()
        : Response.ok(
            service.add(tipoAgenda),
            "Agenda creada correctamente");
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    TipoAgenda loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @DeleteMapping(value = "/delete/{id}")
  public void delete(@PathVariable("id") Long id) {
    TipoAgenda loteOrNull = service.findById(id);
    loteOrNull.setDeleted(true);
    service.update(loteOrNull);
    // service.delete(id);
  }

  @GetMapping("/{categoria}")
  public ResponseEntity<Object> findAllCategorias(@PathVariable String categoria) {
    return Response.ok(service.findAllCategorias(categoria));
  }

}