package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Proceso;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ProcesoRepository extends CrudRepository<Proceso, Long>,
        PagingAndSortingRepository<Proceso, Long> {

}
