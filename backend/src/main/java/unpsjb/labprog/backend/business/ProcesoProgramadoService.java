package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.ProcesoProgramado;
import java.time.LocalDate;
import unpsjb.labprog.backend.DTOs.ProcesoProgramadoDTO;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class ProcesoProgramadoService {

	@Autowired
	ProcesoProgramadoRepository repository;

	//TODO: Mejorar
	public List<ProcesoProgramado> findAll() {
		List<ProcesoProgramado> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
    @Transactional
	public ProcesoProgramado add(ProcesoProgramado procesoProgramado) {
		return repository.save(procesoProgramado);
	}

    public Map<String, List<ProcesoProgramadoDTO>> obtenerProcesosProgramados() {

       LocalDate fechaMañana = LocalDate.now().plusDays(1); 

       List<Object[]> resultados = repository.findProcesosProgramadosParaMañana(fechaMañana);

       Map<String, List<ProcesoProgramadoDTO>> procesosPorEmail = new HashMap<>();

       for (Object[] resultado : resultados) {
           String email = (String) resultado[0];
           String nombreUsuario = (String) resultado[1];
           String codigoLote = (String) resultado[2];
           String proceso = (String) resultado[3];

           ProcesoProgramadoDTO dto = new ProcesoProgramadoDTO(email, nombreUsuario, codigoLote, proceso);

           procesosPorEmail.computeIfAbsent(email, k -> new ArrayList<>()).add(dto);
       }

       return procesosPorEmail;
    }

}