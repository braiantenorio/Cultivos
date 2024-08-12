package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cultivar;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface CultivarRepository extends CrudRepository<Cultivar, Long>,
        PagingAndSortingRepository<Cultivar, Long> {
    @Query("SELECT c FROM Lote l JOIN l.cultivar c WHERE l.fechaDeBaja IS NULL AND l.cultivar.id=:id ")
    List<Cultivar> findLotesActivosByCultivar(long id);

    @Query("SELECT c FROM Cultivar c WHERE c.deleted=?1 ")
    List<Cultivar> findAllCultivares(boolean filtered);

    @Query("SELECT l.nombre FROM Cultivar l WHERE UPPER(l.nombre) LIKE CONCAT('%', UPPER(?1), '%') ")
    List<String> search(String term);
}
