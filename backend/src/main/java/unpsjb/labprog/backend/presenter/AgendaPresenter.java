package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.business.AgendaService;
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


@RestController
@RequestMapping("agendas")

public class AgendaPresenter {

  @Autowired
  AgendaService service;

  @GetMapping
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAll());
  }
  

}