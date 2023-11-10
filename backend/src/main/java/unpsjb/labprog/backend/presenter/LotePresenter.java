package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.LotesCategoriaDTO;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.business.LoteService;
import unpsjb.labprog.backend.business.AgendaService;
import unpsjb.labprog.backend.business.TipoAgendaService;
import unpsjb.labprog.backend.business.CategoriaService;
import unpsjb.labprog.backend.business.ListaDeAtributosService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.business.ProcesoProgramadoService;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import unpsjb.labprog.backend.model.ProcesoProgramado;
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
@RequestMapping("lotes")
public class LotePresenter {

  @Autowired
  LoteService service;

  @Autowired
  AgendaService serviceAgenda;

  @Autowired
  TipoAgendaService serviceTipoAgenda;

  @Autowired
  ProcesoProgramadoService serviceProcesoProgramado;

  @Autowired
  CategoriaService serviceCategoria;

  @Autowired
  UsuarioService serviceUsuario;

  @Autowired
  ListaDeAtributosService serviceListaDeAtributos;

  @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") int id) {
    Lote loteOrNull = service.findById(id);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @RequestMapping(value = "/codigo/{code}", method = RequestMethod.GET)
  public ResponseEntity<Object> findByCode(@PathVariable("code") String code) {
    Lote loteOrNull = service.findByCode(code);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @GetMapping
  // @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findAll(
      @RequestParam(value = "filtered", required = false) boolean filtered,
      @RequestParam(value = "term", required = false) String term,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id", required = false) String sortField,
      @RequestParam(defaultValue = "asc", required = false) String sortDirection) {

    // System.out.println(sortDirection);
    return Response.ok(service.findByPage(service.findAll(filtered, term, sortField, sortDirection), page, size));
  }

  @RequestMapping(value = "/activos/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findAllActivos(@PathVariable("id") long id) {
    return Response.ok(service.findAllActivosByCategoria(serviceCategoria.findById(id)));
  }

  @RequestMapping(value = "/log/{id}", method = RequestMethod.GET)
  public ResponseEntity<Object> findById(@PathVariable("id") long id) {

    return Response.ok(service.findAllRevisions(id));
  }

  @PostMapping
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> crear(@RequestBody Lote lote) {

    List<ProcesoProgramado> procesosCopia = new ArrayList<>();
    LocalDate fechaActual = LocalDate.now();
    if (lote.getAgenda().getTipoAgenda() != null) {
      for (ProcesoProgramado procesoOriginal : lote.getAgenda().getTipoAgenda().getProcesosProgramado()) {
        for (int i = 0; i < procesoOriginal.getCantidad(); i++) {
          ProcesoProgramado procesoCopia = new ProcesoProgramado();
          procesoCopia.setCompletado(false);
          procesoCopia.setProceso(procesoOriginal.getProceso());
          procesoCopia.setDiaInicio(i);

          LocalDate fechaARealizar = fechaActual
              .plusDays((procesoOriginal.getDiaInicio() - 1) + (procesoOriginal.getFrecuencia() * i));
          procesoCopia.setFechaARealizar(fechaARealizar);
          procesosCopia.add(serviceProcesoProgramado.add(procesoCopia));
        }

      }
      lote.getAgenda().setProcesosProgramado(procesosCopia);

    }
    lote.setAgenda(serviceAgenda.add(lote.getAgenda()));

    lote.setCodigo(service.generarCodigo(lote));

    return Response.ok(
        service.add(lote),
        "Lote creado correctamente");
  }

  @PutMapping
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> update(@RequestBody Lote lote) {
    return Response.ok(service.update(lote), "Lote actualizado correctamente");
  }

  @DeleteMapping(value = "/delete/{id}")
  public void delete(@PathVariable("id") Long id) {
    Lote lote = service.findById(id);
    service.delete(id);
    if (lote.getLotePadre() != null) {
      Lote lotePadre = service.findById(lote.getLotePadre().getId());
      lotePadre.setFechaDeBaja(null);
      service.update(lotePadre);
    }
    // service.delete(id);
  }

  @GetMapping("/historia/{loteId}")
  public ResponseEntity<Object> obtenerLotesPadres(@PathVariable Long loteId) {
    return Response.ok(service.obtenerLotesPadres(loteId));
  }

  @GetMapping("/procesosPendientes")
  public ResponseEntity<Object> obtenerLotesPadres(@RequestParam(value = "term", required = false) String lote

      , @RequestParam(value = "dia", required = false) int dia,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return Response
        .ok(serviceProcesoProgramado
            .findByPage(serviceProcesoProgramado.obtenerProcesosProgramadosPendientes(lote, dia), page, size));
  }

  @GetMapping("/search")
  public ResponseEntity<Object> search(@RequestParam(value = "term", required = false) String term

  // ,@RequestParam(value = "proceso", required = false) String proceso
  ) {
    List<String> resul = service.search(term);
    resul.addAll(serviceListaDeAtributos.search(term));
    return Response.ok(resul);
  }

  @RequestMapping(value = "/{id}/procesoprogramado", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> findById(@PathVariable("id") String id,
      @RequestBody ProcesoProgramado procesoProgramado) {
    Lote loteOrNull = service.findByCode(id);
    Agenda agenda = loteOrNull.getAgenda();
    agenda.addprocesoProgramado(serviceProcesoProgramado.add(procesoProgramado));
    serviceAgenda.add(agenda);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @PostMapping("/{loteId}")
  @PreAuthorize("hasRole('MODERATOR')")
  public ResponseEntity<Object> CambiarDeCategoria(@RequestBody LotesCategoriaDTO lotesCategoriaDTO,
      @PathVariable String loteId) {
    Lote lote = service.findByCode(loteId);
    List<Lote> lotes = new ArrayList();
    int sumaCantidades = 0;

    for (Lote lotes1 : lotesCategoriaDTO.getLotes()) {
      if (lotes1.getCategoria().getLimite()) {

        sumaCantidades += lotes1.getCantidad();

      }
      lotes1.setCultivar(lote.getCultivar());
      lotes1.setLotePadre(lote);

    }
    if (sumaCantidades > lote.getCantidad()) {

      return Response.badRequest("");
    }
    for (Lote lotes2 : lotesCategoriaDTO.getLotes()) {

      lotes.add(crear1(lotes2));
    }
    if (sumaCantidades == lote.getCantidad()) {

      lote.setFechaDeBaja(LocalDate.now());

    }
    lote.setCantidad(lote.getCantidad() - sumaCantidades);
    service.update(lote);

    return Response.ok(
        lotes,
        "Lote creado correctamente");
  }

  public Lote crear1(@RequestBody Lote lote) {

    List<ProcesoProgramado> procesosCopia = new ArrayList<>();
    LocalDate fechaActual = LocalDate.now();
    if (lote.getAgenda().getTipoAgenda() != null) {
      for (ProcesoProgramado procesoOriginal : lote.getAgenda().getTipoAgenda().getProcesosProgramado()) {
        for (int i = 0; i < procesoOriginal.getCantidad(); i++) {
          ProcesoProgramado procesoCopia = new ProcesoProgramado();
          procesoCopia.setCompletado(false);
          procesoCopia.setProceso(procesoOriginal.getProceso());
          procesoCopia.setDiaInicio(i);

          LocalDate fechaARealizar = fechaActual
              .plusDays((procesoOriginal.getDiaInicio() - 1) + (procesoOriginal.getFrecuencia() * i));
          procesoCopia.setFechaARealizar(fechaARealizar);
          procesosCopia.add(serviceProcesoProgramado.add(procesoCopia));
        }

      }
      lote.getAgenda().setProcesosProgramado(procesosCopia);

    }
    lote.setAgenda(serviceAgenda.add(lote.getAgenda()));

    lote.setCodigo(service.generarCodigo(lote));

    return service.add(lote);
  }

}
