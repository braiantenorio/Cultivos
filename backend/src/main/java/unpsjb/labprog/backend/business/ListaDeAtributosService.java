package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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

    public List<String> search(String term) {
        return repository.search("%" + term + "%");
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

    public ListaDeAtributos findByNombre(String code) {
        return repository.findByNombre(code).orElse(null);
    }

    public Page<ListaDeAtributos> findByPage(List<ListaDeAtributos> clientes, int page, int size) {
        int start = page * size;
        int end = Math.min(start + size, clientes.size());
        Page<ListaDeAtributos> clientesPage = new PageImpl<>(clientes.subList(start, end), PageRequest.of(page, size),
                clientes.size());
        return clientesPage;
    }

}
