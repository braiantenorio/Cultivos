package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TipoAgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

import unpsjb.labprog.backend.model.Cultivar;
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

  public ResponseEntity<Object> findAll(
      @RequestParam(value = "filtered", required = false) boolean filtered,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response.ok(service.findByPage(service.findAllCultivares(filtered), page, size));
  }

  @RequestMapping(value = "/search", method = RequestMethod.GET)
  public ResponseEntity<Object> search() {
    return Response.ok(service.findAll());
  }

  @PostMapping
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
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

  @PutMapping(value = "/{id}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> update(@PathVariable("id") long id) {
    TipoAgenda loteOrNull = service.findById(id);
    loteOrNull.setDeleted(false);
    return Response.ok(
        service.add(loteOrNull),
        "Agenda creada correctamente");
  }

  @DeleteMapping(value = "/delete/{id}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> delete(@PathVariable("id") Long id) {

    List<TipoAgenda> categorias = service.findLotesActivosByTipoAgenda(id);
    if (categorias.size() > 0) {
      return Response.badRequest("");
    }
    TipoAgenda loteOrNull = service.findById(id);
    loteOrNull.setDeleted(true);
    service.update(loteOrNull);
    return Response.ok(
        null,
        "Categoria eliminada correctamente");
    // service.delete(id);
  }

  @GetMapping("/{categoria}")
  public ResponseEntity<Object> findAllCategorias(@PathVariable String categoria) {
    return Response.ok(service.findAllCategorias(categoria));
  }

}