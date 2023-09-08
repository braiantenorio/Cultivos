package unpsjb.labprog.backend.business;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Agenda;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface AgendaRepository extends CrudRepository<Agenda, Long>,
        PagingAndSortingRepository<Agenda, Long>  {
    @Query("SELECT l FROM Agenda l WHERE l.categoria.id = ?1 AND l.fechaInicio IS NULL")
    Optional<Agenda> findByCategoria(Long code);
}