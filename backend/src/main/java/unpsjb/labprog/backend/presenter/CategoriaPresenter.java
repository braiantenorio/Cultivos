package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.CategoriaDTO;
import unpsjb.labprog.backend.business.CategoriaService;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Categoria;
import unpsjb.labprog.backend.model.Lote;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("categorias")

public class CategoriaPresenter {

  @Autowired
  CategoriaService service;

  @GetMapping
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAllCategorias());
  }

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Categoria loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(new CategoriaDTO(loteOrNull)) : Response.notFound();
  }

  @PostMapping
  public ResponseEntity<Object> crear(@RequestBody Categoria tipoAgenda) {

    return Response.ok(
        service.add(tipoAgenda),
        "Agenda creada correctamente");
  }

  @DeleteMapping(value = "/delete/{id}")
  public ResponseEntity<Object> delete(@PathVariable("id") long id) {
    List<Categoria> categorias = service.findLotesActivosByCategoria(id);
    if (categorias.size() > 0) {
      return Response.badRequest("");
    }
    service.delete(id);
    return Response.ok(
        null,
        "Categoria eliminada correctamente");
  }

}