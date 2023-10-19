package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import unpsjb.labprog.backend.model.Agenda;

@Repository
public interface AgendaRepository extends CrudRepository<Agenda, Long>, PagingAndSortingRepository<Agenda, Long> {
}