package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.model.Notificacion;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("notificaciones")

public class NotificacionPresenter {

  @Autowired
  NotificacionService service;

  @GetMapping
  public ResponseEntity<Object> findAll() {
    return Response.ok(service.findAll());
  }

  // para probar el envio de correo
  @GetMapping(value = "/enviar")
  public ResponseEntity<Object> crear() {
    service.enviarRecordatoriosProcesos();
    return Response.ok(service.findAll(), "Enviado correctamente");
  }

  @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> update(@PathVariable("id") long id) {
    Notificacion notificacion = service.findById(id);
    notificacion.setRead(true);
    return (notificacion != null) ? Response.ok(service.update(notificacion)) : Response.notFound();
  }

}