package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Proceso;

@Service
public class ProcesoService {

    @Autowired
    ProcesoRepository repository;

    // TODO: Mejorar
    public List<Proceso> findAll() {
        List<Proceso> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    public Proceso findById(long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Proceso update(Proceso lote) {
        return repository.save(lote);
    }

    @Transactional
    public Proceso add(Proceso lote) {
        return repository.save(lote);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}
