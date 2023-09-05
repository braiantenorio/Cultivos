package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.model.RegistroDeProcesos;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.business.RegistroDeProcesosService;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.ArrayList;


@RestController
@RequestMapping("registros-de-procesos")

public class RegistroDeProcesosPresenter {

  @Autowired
  RegistroDeProcesosService service;

  @GetMapping
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAll());
  }

  @RequestMapping(value = "/lotes/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") long id) {
    List<RegistroDeProcesos> registros = service.obtenerRegistrosPorLote(id);

    if (registros.isEmpty()) {
      return Response.notFound();
    }

    List<Proceso> procesos = new ArrayList<>();
    for (RegistroDeProcesos registro : registros) {
      procesos.add(registro.getProceso());
    }

    return Response.ok(procesos);
  }

}