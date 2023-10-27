package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.AtributoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

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
  public ResponseEntity<Object> findAll(@RequestParam(value = "filtered", required = false) boolean filtered,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response.ok(service.findByPage(service.findAllCategorias(filtered), page, size));
  }

  @RequestMapping(value = "/search", method = RequestMethod.GET)
  public ResponseEntity<Object> search(@RequestParam(value = "filtered", required = false) boolean filtered) {
    return Response.ok(service.findAllCategorias(filtered));
  }

  @PostMapping
  public ResponseEntity<Object> crear(@RequestBody Atributo tipoAgenda) {

    return Response.ok(
        service.add(tipoAgenda),
        "Agenda creada correctamente");
  }

  @PutMapping(value = "/{id}")
  public ResponseEntity<Object> update(@PathVariable("id") long id) {
    Atributo loteOrNull = service.findById(id);
    loteOrNull.setDeleted(false);
    return Response.ok(
        service.add(loteOrNull),
        "Agenda creada correctamente");
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Atributo loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @DeleteMapping(value = "/delete/{id}")
  public ResponseEntity<Object> delete(@PathVariable("id") long id) {
    List<Atributo> categorias = service.findTipoDeProcesosByAtributo(id);
    if (categorias.size() > 0) {
      return Response.badRequest("");
    }
    service.delete(id);
    return Response.ok(
        null,
        "Categoria eliminada correctamente");
  }

}