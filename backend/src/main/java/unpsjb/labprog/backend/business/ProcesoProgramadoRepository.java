package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.ProcesoProgramado;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ProcesoProgramadoRepository extends CrudRepository<ProcesoProgramado, Long>,
        PagingAndSortingRepository<ProcesoProgramado, Long>  {
 
}