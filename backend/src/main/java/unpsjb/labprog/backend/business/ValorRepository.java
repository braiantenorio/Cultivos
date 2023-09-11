package unpsjb.labprog.backend.business;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Valor;
import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ValorRepository extends CrudRepository<Valor, Long>,
		PagingAndSortingRepository<Valor, Long> {

	@Query("SELECT l FROM Valor l WHERE l.proceso.id = ?1")
	Optional<Lote> processValues(Long id);
}
