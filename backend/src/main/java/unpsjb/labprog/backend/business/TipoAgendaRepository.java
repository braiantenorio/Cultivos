package unpsjb.labprog.backend.business;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import unpsjb.labprog.backend.model.TipoAgenda;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface TipoAgendaRepository extends CrudRepository<TipoAgenda, Long>,
        PagingAndSortingRepository<TipoAgenda, Long> {
    @Query("SELECT l FROM TipoAgenda l WHERE l.categoria = ?1 AND l.version=?2 AND l.deleted=false ")
    Optional<TipoAgenda> findByCategoria(String categoria,String version);

    @Query("SELECT l FROM TipoAgenda l WHERE l.deleted=false ")
    List<TipoAgenda> findAllActivos();
}
