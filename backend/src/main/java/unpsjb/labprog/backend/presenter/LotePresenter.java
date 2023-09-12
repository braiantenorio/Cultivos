package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.business.LoteService;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.business.AgendaService;
import unpsjb.labprog.backend.business.ProcesoProgramadoService;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import unpsjb.labprog.backend.model.ProcesoProgramado; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("lotes")
public class LotePresenter {

  @Autowired
  LoteService service;
  @Autowired
  AgendaService serviceAgenda;
  @Autowired
  ProcesoProgramadoService serviceProcesoProgramado;

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Lote loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }
     @RequestMapping(value = "/{code}", method = RequestMethod.GET)
  public ResponseEntity<Object> findByCode(@PathVariable("code") String code) {
     Lote loteOrNull = service.findByCode(code);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @GetMapping
  public ResponseEntity<Object> findAll(
      @RequestParam(value = "filtered", required = false, defaultValue = "false") boolean filtered) {
    return Response.ok(service.findAll(filtered));
  }

  @PostMapping
  public ResponseEntity<Object> crear(@RequestBody Lote lote) {

    Agenda agenda = serviceAgenda.findByCategoria(lote.getCategoria().getId());
    if (agenda != null) {
  
      Agenda agendaCopia = new Agenda();
      agendaCopia.setCategoria(agenda.getCategoria());
    
      agendaCopia.setFechaInicio(LocalDate.now());
  
    
  
      List<ProcesoProgramado> procesosCopia = new ArrayList<>();
    
      for (ProcesoProgramado procesoOriginal : agenda.getProcesosProgramado()) {
          ProcesoProgramado procesoCopia = new ProcesoProgramado();
          procesoCopia.setCompletado(false);
          procesoCopia.setProceso(procesoOriginal.getProceso());
        
          LocalDate fechaActual = LocalDate.now();
          LocalDate fechaARealizar = fechaActual.plusDays(procesoOriginal.getDia());
          procesoCopia.setFechaARealizar(fechaARealizar);
          procesosCopia.add(serviceProcesoProgramado.add(procesoCopia));
      }
      
      agendaCopia.setProcesosProgramado(procesosCopia);
    
  
     lote.setAgenda(serviceAgenda.add(agendaCopia));
    
    }

    return Response.ok(
        service.add(lote),
        "Lote creado correctamente");
  }

  @PutMapping
  public ResponseEntity<Object> update(@RequestBody Lote lote) {
    return Response.ok(service.update(lote), "Lote actualizado correctamente");
  }

  @DeleteMapping(value = "/delete/{id}")
  public void delete(@PathVariable("id") Long id) {
    service.delete(id);
  }

}
