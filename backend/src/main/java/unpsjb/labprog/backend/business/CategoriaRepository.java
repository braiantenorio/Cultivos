package unpsjb.labprog.backend.business;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Categoria;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface CategoriaRepository extends CrudRepository<Categoria, Long>,
        PagingAndSortingRepository<Categoria, Long>  {
    
}
