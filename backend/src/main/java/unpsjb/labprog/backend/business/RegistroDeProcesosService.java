package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.RegistroDeProcesos;

@Service
public class RegistroDeProcesosService {

	@Autowired
	RegistroDeProcesosRepository repository;

	//TODO: Mejorar
	public List<RegistroDeProcesos> findAll() {
		List<RegistroDeProcesos> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}
    public List<RegistroDeProcesos> obtenerRegistrosPorLote(Long idDelLote) {
        return repository.findAllByLoteId(idDelLote);
    }


}