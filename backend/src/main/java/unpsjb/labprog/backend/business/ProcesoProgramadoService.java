package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import java.time.LocalDate;
import unpsjb.labprog.backend.DTOs.ProcesoProgramadoDTO;
import java.util.Map;
import java.util.HashMap;

@Service
public class ProcesoProgramadoService {

    @Autowired
    ProcesoProgramadoRepository repository;

    @Autowired
    AgendaService agendaService;

    @Autowired
    LoteService loteService;

    // TODO: Mejorar
    public List<ProcesoProgramado> findAll() {
        List<ProcesoProgramado> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    @Transactional
    public ProcesoProgramado add(ProcesoProgramado procesoProgramado) {
        return repository.save(procesoProgramado);
    }

    @Transactional
    public ProcesoProgramado update(ProcesoProgramado procesoProgramado) {
        return repository.save(procesoProgramado);
    }

    public List<ProcesoProgramado> findProcesoProgramado(String lote, String proceso) {
        return repository.findProcesoProgramado(lote, proceso);
    }

    public ProcesoProgramado findProcesoProgramadoUltimo(String lote, String proceso) {
        return repository.findProcesoProgramadoUltimo(lote, proceso);
    }

    public Map<String, List<ProcesoProgramadoDTO>> obtenerProcesosProgramados() {

        LocalDate fechaMañana = LocalDate.now().plusDays(1);

        List<Object[]> resultados = repository.findProcesosProgramadosParaMañana(fechaMañana);

        Map<String, List<ProcesoProgramadoDTO>> procesosPorEmail = new HashMap<>();

        for (Object[] resultado : resultados) {
            String email = (String) resultado[0];
            // String nombreUsuario = (String) resultado[1];
            String codigoLote = (String) resultado[2];
            ProcesoProgramado proceso = (ProcesoProgramado) resultado[3];

            ProcesoProgramadoDTO dto = new ProcesoProgramadoDTO(codigoLote, proceso.getProceso(),
                    proceso.getFechaARealizar(), proceso.getCompletado());

            procesosPorEmail.computeIfAbsent(email, k -> new ArrayList<>()).add(dto);
        }

        return procesosPorEmail;
    }

    public List<ProcesoProgramadoDTO> obtenerProcesosProgramadosPendientes(String codigo, int dia) {

        LocalDate fecha = LocalDate.now().plusDays(dia);

        List<Object[]> resultados = repository.findProcesosProgramadosPendientes(fecha, "%" + codigo + "%");
        List<ProcesoProgramadoDTO> procesosPendientes = new ArrayList<>();

        for (Object[] resultado : resultados) {
            String codigoLote = (String) resultado[0];
            ProcesoProgramado proceso = (ProcesoProgramado) resultado[1];

            ProcesoProgramadoDTO dto = new ProcesoProgramadoDTO(codigoLote, proceso.getProceso(),
                    proceso.getFechaARealizar(), proceso.getCompletado());

            procesosPendientes.add(dto);
        }

        return procesosPendientes;
    }

    public void crearProcesosProgramadosCantidadIndefinida() {
        List<Object[]> resultados = repository.findProcesosProgramadosUltimos();
        for (Object[] resultado : resultados) {
            Lote lote = (Lote) resultado[0];
            ProcesoProgramado proceso = (ProcesoProgramado) resultado[1];
            int repeticiones = proceso.getCantidad() * proceso.getFrecuencia();

            if (repeticiones < 7) {

                if (proceso.getFrecuencia() > 7) {
                    repeticiones = 1;
                } else {
                    repeticiones = 7 / proceso.getFrecuencia();
                }
                proceso.setDiaInicio(1);
                this.update(proceso);
                LocalDate fechaActual = proceso.getFechaARealizar();
                for (int i = 0; i < repeticiones; i++) {
                    ProcesoProgramado procesoCopia = new ProcesoProgramado();
                    procesoCopia.setCompletado(false);
                    procesoCopia.setProceso(proceso.getProceso());
                    procesoCopia.setDiaInicio(i + 1);

                    LocalDate fechaARealizar = fechaActual
                            .plusDays(proceso.getFrecuencia() * (i + 1));
                    procesoCopia.setFechaARealizar(fechaARealizar);
                    if (i == repeticiones - 1) {
                        procesoCopia.setDiaInicio(0);
                        procesoCopia.setFrecuencia(proceso.getFrecuencia());
                        procesoCopia.setCantidad(repeticiones + proceso.getCantidad());
                    }
                    lote.getAgenda().addprocesoProgramado(this.add(procesoCopia));

                }
                lote.setAgenda(agendaService.update(lote.getAgenda()));
                loteService.update(lote);
            }
        }
    }

    public Page<ProcesoProgramadoDTO> findByPage(List<ProcesoProgramadoDTO> clientes, int page, int size) {
        int start = page * size;
        int end = Math.min(start + size, clientes.size());
        Page<ProcesoProgramadoDTO> clientesPage = new PageImpl<>(clientes.subList(start, end),
                PageRequest.of(page, size),
                clientes.size());
        return clientesPage;
    }

}