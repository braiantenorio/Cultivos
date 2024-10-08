package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.LotesCategoriaDTO;
import unpsjb.labprog.backend.model.Agenda;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Categoria;
import unpsjb.labprog.backend.business.LoteService;
import unpsjb.labprog.backend.business.AgendaService;
import unpsjb.labprog.backend.business.TipoAgendaService;
import unpsjb.labprog.backend.business.CategoriaService;
import unpsjb.labprog.backend.business.CultivarService;
import unpsjb.labprog.backend.business.ListaDeAtributosService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.business.ProcesoProgramadoService;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
  CultivarService serviceCultivar;

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
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> crear(@RequestBody Lote lote) {

    List<ProcesoProgramado> procesosCopia = new ArrayList<>();
    LocalDate fechaActual = LocalDate.now();
    if (lote.getAgenda().getTipoAgenda() != null) {
      for (ProcesoProgramado procesoOriginal : lote.getAgenda().getTipoAgenda().getProcesosProgramado()) {
        int repeticiones = procesoOriginal.getCantidad();
        if (repeticiones == 0) {
          if (procesoOriginal.getFrecuencia() > 7) {
            repeticiones = 1;
          } else {
            repeticiones = 7 / procesoOriginal.getFrecuencia();
          }
        }
        for (int i = 0; i < repeticiones; i++) {
          ProcesoProgramado procesoCopia = new ProcesoProgramado();
          procesoCopia.setCompletado(false);
          procesoCopia.setProceso(procesoOriginal.getProceso());
          procesoCopia.setDiaInicio(i + 1);

          LocalDate fechaARealizar = fechaActual
              .plusDays((procesoOriginal.getDiaInicio() - 1) + (procesoOriginal.getFrecuencia() * i));
          procesoCopia.setFechaARealizar(fechaARealizar);
          if (procesoOriginal.getCantidad() == 0 && i == repeticiones - 1) {

            procesoCopia.setDiaInicio(0);
            procesoCopia.setFrecuencia(procesoOriginal.getFrecuencia());
            procesoCopia.setCantidad(repeticiones);
          }
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
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Object> update(@RequestBody LotesCategoriaDTO loteDTO) {

    // Verificar si el lote padre está vacío
    if (loteDTO.getLotes().get(1).getCodigo() == null || loteDTO.getLotes().get(1).getCodigo().equals("")) {
      // Solo actualiza el lote hijo
      Lote loteHijo = loteDTO.getLotes().get(0);

      return Response.ok(service.update(loteHijo), "Lote hijo actualizado correctamente");
    } else {
      if (loteDTO.isEstado() == true) {

        Lote lotePadre = service.findByCode(loteDTO.getLotes().get(1).getCodigo());
        if (lotePadre == null) {
          return ResponseEntity.badRequest().body("Código del lote padre no encontrado.");
        }
        Lote loteHijo = loteDTO.getLotes().get(0);
        String[] codigoPadreParts1 = loteDTO.getLotes().get(1).getCodigo().split("-");
        String[] codigoHijoParts1 = loteDTO.getLotes().get(0).getCodigo().split("-");
        List<Categoria> categorias = lotePadre.getCategoria().getSubCategorias();
        Categoria c1 = serviceCategoria.findByCode(codigoHijoParts1[1]);
        if (!codigoPadreParts1[0].equals(codigoHijoParts1[0]) || !categorias.stream()
            .anyMatch(categoria -> categoria.equals(c1))) {
          return ResponseEntity.badRequest().body("Código del lote padre no encontrado.");
        }
        if (lotePadre.getLotePadre() != null && lotePadre.getLotePadre().getCodigo().equals(loteHijo.getCodigo())) {
          return ResponseEntity.badRequest().body("Código del lote padre no encontrado.");
        }
        loteHijo.setLotePadre(lotePadre);

        return Response.ok(service.update(loteHijo), "Lote actualizado correctamente");
      }
      // Lote padre no está vacío
      else {
        Lote lotePadre1 = service.findByCode(loteDTO.getLotes().get(1).getCodigo());
        // Verificar si el código ya existe y está inactivo
        if (lotePadre1 != null) {
          return ResponseEntity.badRequest().body("El código existe");
        }

        // Validar condiciones del lote padre
        String[] codigoPadreParts = loteDTO.getLotes().get(1).getCodigo().split("-");
        String[] codigoHijoParts = loteDTO.getLotes().get(0).getCodigo().split("-");
        if (codigoPadreParts.length != 4) {
          return ResponseEntity.badRequest().body("Formato invalido");
        }
        // Validar primera parte del código
        if (!codigoPadreParts[0].equals(codigoHijoParts[0])) {
          return ResponseEntity.badRequest().body("La primera parte del código no coincide.");
        }

        // Validar segunda parte del código
        Categoria c = serviceCategoria.findByCode(codigoPadreParts[1]);
        if (c == null) {
          return ResponseEntity.badRequest().body("Categoría no encontrada.");
        }
        // Obtener las subcategorías del lote padre
        List<Categoria> subCategorias = c.getSubCategorias();

        Lote lotehijo1 = service.findByCode(loteDTO.getLotes().get(0).getCodigo());
        if (!subCategorias.stream().anyMatch(categoria -> categoria.equals(lotehijo1.getCategoria()))) {
          return ResponseEntity.badRequest().body("La categoría no pertenece a las subcategorías del lote padre.");
        }

        // Validar número de secuencia y asegurarse de que es un número
        try {

          int numeroSecuenciaHijo = Integer.parseInt(codigoPadreParts[2]);

          // Validar terminación del año
          int yearHijo = Integer.parseInt(codigoHijoParts[3]);
          int yearPadre = Integer.parseInt(codigoPadreParts[3]);
          if (yearHijo < yearPadre || yearHijo > yearPadre + 1) {
            return ResponseEntity.badRequest().body("La terminación del año del código del lote padre es inválida.");
          }

          // Actualizar lote (hijo y padre)
          Lote loteHij = loteDTO.getLotes().get(0);
          Lote lotePadre2 = loteDTO.getLotes().get(1);
          lotePadre2.setCultivar(lotehijo1.getCultivar());
          lotePadre2.setCategoria(c);
          lotePadre2.setFechaDeBaja(LocalDate.now());
          Lote lotepadreA = service.add(lotePadre2);
          LocalDate fecha = lotepadreA.getFecha();
          int year = fecha.getYear();
          int lastTwoDigitsOfYear = year % 100;
          if (lastTwoDigitsOfYear != yearPadre) {
            // Restar un año a la fecha
            lotepadreA.setFecha(fecha.minusYears(lastTwoDigitsOfYear - yearPadre));
          }
          loteHij.setLotePadre(service.update(lotepadreA));

          return Response.ok(service.update(loteHij), "Lote actualizado correctamente");

        } catch (NumberFormatException e) {
          return ResponseEntity.badRequest().body("El número de secuencia no es válido.");
        }
      }
    }
  }

  @RequestMapping(value = "/lotepadre/{code}", method = RequestMethod.GET)

  public ResponseEntity<Object> findByCodeP(@PathVariable("code") String code) {
    Lote loteOrNull = service.findByCode(code);
    return (loteOrNull != null) ? Response.ok(loteOrNull.getLotePadre()) : Response.notFound();
  }

  @DeleteMapping(value = "/delete/{id}")
  public void delete(@PathVariable("id") Long id) {
    Lote lote = service.findById(id);
    service.delete(id);
    if (lote.getLotePadre() != null && lote.getCategoria().getLimite() == true) {
      Lote lotePadre = service.findById(lote.getLotePadre().getId());
      lotePadre.setFechaDeBaja(null);
      lotePadre.setCantidad(lotePadre.getCantidad() + lote.getCantidad());
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

  @GetMapping("/categoria-cultivar/search")
  public ResponseEntity<Object> searchC(@RequestParam(value = "term", required = false) String term

  // ,@RequestParam(value = "proceso", required = false) String proceso
  ) {
    List<String> resul = service.search(term);
    resul.addAll(serviceCategoria.search(term));
    resul.addAll(serviceCultivar.search(term));
    return Response.ok(resul);
  }

  @RequestMapping(value = "/{id}/procesoprogramado", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<Object> findById(@PathVariable("id") String id,
      @RequestBody ProcesoProgramado procesoProgramado) {
    Lote loteOrNull = service.findByCode(id);
    Agenda agenda = loteOrNull.getAgenda();
    agenda.addprocesoProgramado(serviceProcesoProgramado.add(procesoProgramado));
    serviceAgenda.add(agenda);
    return (loteOrNull != null) ? Response.ok(loteOrNull) : Response.notFound();
  }

  @PostMapping("/{loteId}")
  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
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
        int repeticiones = procesoOriginal.getCantidad();
        if (repeticiones == 0) {
          if (procesoOriginal.getFrecuencia() > 7) {
            repeticiones = 1;
          } else {
            repeticiones = 7 / procesoOriginal.getFrecuencia();
          }
        }
        for (int i = 0; i < repeticiones; i++) {
          ProcesoProgramado procesoCopia = new ProcesoProgramado();
          procesoCopia.setCompletado(false);
          procesoCopia.setProceso(procesoOriginal.getProceso());
          procesoCopia.setDiaInicio(i + 1);

          LocalDate fechaARealizar = fechaActual
              .plusDays((procesoOriginal.getDiaInicio() - 1) + (procesoOriginal.getFrecuencia() * i));
          procesoCopia.setFechaARealizar(fechaARealizar);
          if (procesoOriginal.getCantidad() == 0 && i == repeticiones - 1) {

            procesoCopia.setDiaInicio(0);
            procesoCopia.setFrecuencia(procesoOriginal.getFrecuencia());
            procesoCopia.setCantidad(repeticiones);
          }
          procesosCopia.add(serviceProcesoProgramado.add(procesoCopia));

        }

      }
      lote.getAgenda().setProcesosProgramado(procesosCopia);

    }
    lote.setAgenda(serviceAgenda.add(lote.getAgenda()));

    lote.setCodigo(service.generarCodigo(lote));

    return service.add(lote);
  }

  @GetMapping("/mostrar-pdf/{id}/{fileName}.pdf")
  public ResponseEntity<byte[]> mostrarPDF(@PathVariable("id") Long id, @PathVariable("fileName") String fileName)
      throws IOException {
    byte[] contenidoPDF = service.generarContenidoPDF(id);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);

    return ResponseEntity
        .ok()
        .headers(headers)
        .body(contenidoPDF);
  }

}
