package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Categoria;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface CategoriaRepository extends CrudRepository<Categoria, Long>,
                PagingAndSortingRepository<Categoria, Long> {

}
