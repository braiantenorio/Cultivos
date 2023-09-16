package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.AgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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