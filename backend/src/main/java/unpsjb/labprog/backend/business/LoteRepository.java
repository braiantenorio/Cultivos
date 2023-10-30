package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Lote;
import java.util.Optional;
import java.time.LocalDate;
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

        @Query("SELECT COALESCE(SUM(l.cantidad), 0) FROM Lote l WHERE l.lotePadre.id = ?1 AND l.categoria.limite = true ")
        int calculateTotalCantidadSublotes(Long lotePadreId);

        @Query("SELECT l FROM Lote l WHERE l.fechaDeBaja IS NULL ")
        List<Lote> findAllActivos();

        @Query("SELECT l FROM Lote l " +
                        "JOIN l.categoria c " +
                        "WHERE l.deleted = false " +
                        "AND l.fechaDeBaja IS NULL " +
                        "AND :categoria MEMBER OF c.subCategorias")
        List<Lote> findAllActivosByCategoria(@Param("categoria") Categoria categoria);

        @Query("SELECT COUNT(l) FROM Lote l " +
                        "JOIN l.categoria c " +
                        "WHERE c = :categoria " +
                        "AND YEAR(l.fecha) = YEAR(CURRENT_DATE)")
        int countLotesByCategoria(@Param("categoria") Categoria categoria);

        @Query("SELECT l.codigo FROM Lote l WHERE UPPER(l.codigo) LIKE CONCAT('%', UPPER(?1), '%') ")
        List<String> searchLote(String term);

        @Query("SELECT l FROM Lote l " +
                        "WHERE (l.fechaDeBaja IS NULL AND l.fecha <= :localDate) " +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)")
        List<Lote> findAllFecha(@Param("localDate") LocalDate localDate);

        @Query("SELECT l.id,l, v FROM Lote l JOIN l.procesos p JOIN p.valores v WHERE ((l.fechaDeBaja IS NULL AND l.fecha <= :localDate) "
                        +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)) AND v.atributo.id IN :listaAtributos")
        List<Object[]> findLotesAndValoresByAtributos(@Param("listaAtributos") List<Long> listaAtributos,
                        LocalDate localDate);

        @Query("SELECT l FROM Lote l WHERE ((l.fechaDeBaja IS NULL AND l.fecha <= :localDate) " +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)) AND l.categoria = :categoria")
        List<Lote> findLotesByCategoria(@Param("categoria") Categoria categoria, LocalDate localDate);

        @Query("SELECT l.id, l, v FROM Lote l JOIN l.procesos p JOIN p.valores v WHERE ((l.fechaDeBaja IS NULL AND l.fecha <= :localDate) "
                        +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)) AND v.atributo.id IN :listaAtributos AND l.categoria = :categoria")
        List<Object[]> findLotesAndValoresByAtributosAndCategoria(
                        @Param("listaAtributos") List<Long> listaAtributos,
                        @Param("categoria") Categoria categoria, LocalDate localDate);
}
