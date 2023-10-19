package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import unpsjb.labprog.backend.model.Atributo;

@Repository
public interface AtributoRepository extends CrudRepository<Atributo, Long>, PagingAndSortingRepository<Atributo, Long> {
}