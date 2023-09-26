package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.ListaDeAtributos;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ListaDeAtributosRepository extends CrudRepository<ListaDeAtributos, Long>,
                PagingAndSortingRepository<ListaDeAtributos, Long> {

}
