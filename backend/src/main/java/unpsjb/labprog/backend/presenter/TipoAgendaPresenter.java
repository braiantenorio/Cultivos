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
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("tipoagendas")

public class TipoAgendaPresenter {

  @Autowired
  TipoAgendaService service;

  @GetMapping
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAll());
  }
  @PostMapping
	public ResponseEntity<Object> crear(@RequestBody TipoAgenda tipoAgenda) {

		return Response.ok(
				service.add(tipoAgenda),
				"Agenda creada correctamente");
	}

}