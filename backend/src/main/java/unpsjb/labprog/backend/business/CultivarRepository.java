package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cultivar;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface CultivarRepository extends CrudRepository<Cultivar, Long>,
                PagingAndSortingRepository<Cultivar, Long> {

}
