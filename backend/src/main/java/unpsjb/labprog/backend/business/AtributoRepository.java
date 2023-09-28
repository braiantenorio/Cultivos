package unpsjb.labprog.backend.business;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Atributo;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface AtributoRepository extends CrudRepository<Atributo, Long>,
        PagingAndSortingRepository<Atributo, Long>  {
}