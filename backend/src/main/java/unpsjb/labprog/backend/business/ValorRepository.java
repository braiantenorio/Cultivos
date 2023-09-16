package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Valor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ValorRepository extends CrudRepository<Valor, Long>, PagingAndSortingRepository<Valor, Long> {

}
