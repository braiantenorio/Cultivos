package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.CultivarService;
import unpsjb.labprog.backend.model.Cultivar;

import java.util.List;

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
@RequestMapping("cultivares")

public class CultivarPresenter {

  @Autowired
  CultivarService service;

  @GetMapping
  //@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findAll(
      @RequestParam(value = "filtered", required = false) boolean filtered,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response.ok(service.findByPage(service.findAllCultivares(filtered), page, size));
  }

  @RequestMapping(value = "/search", method = RequestMethod.GET)
  public ResponseEntity<Object> search(@RequestParam(value = "filtered", required = false) boolean filtered) {
    return Response.ok(service.findAllCultivares(filtered));
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Cultivar loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @PostMapping
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> crear(@RequestBody Cultivar tipoAgenda) {

    return Response.ok(
        service.add(tipoAgenda),
        "Agenda creada correctamente");
  }

  @PutMapping(value = "/{id}")
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> update(@PathVariable("id") long id) {
    Cultivar loteOrNull = service.findById(id);
    loteOrNull.setDeleted(false);
    return Response.ok(
        service.add(loteOrNull),
        "Agenda creada correctamente");
  }

  @DeleteMapping(value = "/delete/{id}")
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> delete(@PathVariable("id") long id) {
    List<Cultivar> categorias = service.findLotesActivosByCultivar(id);
    if (categorias.size() > 0) {
      return Response.badRequest("");
    }
    service.delete(id);
    return Response.ok(
        null,
        "Categoria eliminada correctamente");
  }

}