package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Lote;
import java.util.Optional;
import java.util.List;
import unpsjb.labprog.backend.model.Categoria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

@Repository
public interface LoteRepository extends CrudRepository<Lote, Long>, PagingAndSortingRepository<Lote, Long> {

    @Query("SELECT l FROM Lote l WHERE UPPER(l.codigo) = UPPER(?1)")
    Optional<Lote> findByCode(String code);

    @Query("SELECT COALESCE(SUM(l.cantidad), 0) FROM Lote l WHERE l.lotePadre.id = ?1")
    int calculateTotalCantidadSublotes(Long lotePadreId);

    @Query("SELECT l FROM Lote l WHERE l.esHoja=true ")
    List<Lote> findAllActivos();

    @Query("SELECT l FROM Lote l " +
            "JOIN l.categoria c " +
            "WHERE l.deleted = false " +
            "AND l.esHoja = true " +
            "AND :categoria MEMBER OF c.subCategorias")
    List<Lote> findAllActivosByCategoria(@Param("categoria") Categoria categoria);

    @Query("SELECT COUNT(l) FROM Lote l " +
            "JOIN l.categoria c " +
            "WHERE c = :categoria")
    int countLotesByCategoria(@Param("categoria") Categoria categoria);

}
