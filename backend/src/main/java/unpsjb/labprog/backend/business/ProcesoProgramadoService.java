package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import java.time.LocalDate;
import unpsjb.labprog.backend.DTOs.ProcesoProgramadoDTO;
import java.util.Map;
import java.util.HashMap;

@Service
public class ProcesoProgramadoService {

    @Autowired
    ProcesoProgramadoRepository repository;

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

    public Map<String, List<ProcesoProgramadoDTO>> obtenerProcesosProgramados() {

        LocalDate fechaMañana = LocalDate.now().plusDays(1);

        List<Object[]> resultados = repository.findProcesosProgramadosParaMañana(fechaMañana);

        Map<String, List<ProcesoProgramadoDTO>> procesosPorEmail = new HashMap<>();

        for (Object[] resultado : resultados) {
            String email = (String) resultado[0];
            String nombreUsuario = (String) resultado[1];
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

}