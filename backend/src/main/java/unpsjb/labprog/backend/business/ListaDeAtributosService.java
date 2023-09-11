package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ListaDeAtributos;

@Service
public class ListaDeAtributosService {

    @Autowired
    ListaDeAtributosRepository repository;

    public List<ListaDeAtributos> findAll() {
        List<ListaDeAtributos> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    public ListaDeAtributos findById(long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public ListaDeAtributos update(ListaDeAtributos lote) {
        return repository.save(lote);
    }

    @Transactional
    public ListaDeAtributos add(ListaDeAtributos lote) {
        return repository.save(lote);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}
