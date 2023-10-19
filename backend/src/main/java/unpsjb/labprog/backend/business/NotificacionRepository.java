package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import unpsjb.labprog.backend.model.Notificacion;

@Repository
public interface NotificacionRepository extends CrudRepository<Notificacion, Long>,
                PagingAndSortingRepository<Notificacion, Long> {
}