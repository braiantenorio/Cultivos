package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Lote;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;
import unpsjb.labprog.backend.model.Categoria;
import unpsjb.labprog.backend.model.Cultivar;

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

        @Query(value = "SELECT COALESCE(MAX(CAST( " +
                        "SUBSTRING( " +
                        "l.codigo, " +
                        "POSITION('-' IN l.codigo) + 1 + POSITION('-' IN SUBSTRING(l.codigo, POSITION('-' IN l.codigo) + 1)), "
                        +
                        "POSITION('-' IN SUBSTRING(l.codigo, POSITION('-' IN l.codigo) + 1 + POSITION('-' IN SUBSTRING(l.codigo, POSITION('-' IN l.codigo) + 1)))) - 1 "
                        +
                        ") " +
                        "AS INTEGER)),0) " +
                        "FROM lotes l " +

                        "JOIN categorias c ON l.categoria_id = c.id " +
                        "WHERE c.id = :categoriaId " +
                        "AND l.cultivar_id = :cultivarId " +
                        "AND EXTRACT(YEAR FROM l.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
        int countLotesByCategoria(@Param("categoriaId") Long categoriaId, @Param("cultivarId") Long cultivarId);

        @Query("SELECT l.codigo FROM Lote l WHERE UPPER(l.codigo) LIKE CONCAT('%', UPPER(?1), '%') ")
        List<String> searchLote(String term);

        @Query(value = "SELECT c.nombre, ca.nombre, l.codigo, l.cantidad, lo.cantidad FROM lotes_audit_log l " +
                        "JOIN lotes lo on lo.id = l.id " +
                        "JOIN cultivares c on lo.cultivar_id=c.id " +
                        "JOIN categorias ca on lo.categoria_id=ca.id " +
                        "WHERE l.rev = (SELECT l2.rev FROM lotes_audit_log l2 " +
                        "WHERE l2.id = l.id " +
                        "ORDER BY l2.cantidad DESC " +
                        "LIMIT 1) " +
                        "AND lo.deleted = false " +
                        "AND l.fecha BETWEEN :fechaDesde AND :fechaHasta", nativeQuery = true)
        List<Object[]> findAllFechaWithTotalCantidad(@Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT l.id, l, v, COALESCE(SUM(ls.cantidad), 0) AS totalCantidad FROM Lote l " +
                        "JOIN l.procesos p " +
                        "JOIN p.valores v " +
                        "LEFT JOIN l.subLotes ls " +
                        "WHERE ((l.fechaDeBaja IS NULL AND l.fecha <= :localDate) " +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)) " +
                        "AND v.atributo.id IN :listaAtributos AND ls.fecha <= :localDate GROUP BY 3,2,1")
        List<Object[]> findLotesAndValoresByAtributos(@Param("listaAtributos") List<Long> listaAtributos,
                        @Param("localDate") LocalDate localDate);

        @Query(value = "SELECT c.nombre, ca.nombre, l.codigo, l.cantidad, lop.codigo, lo.fecha, lo.cantidad FROM lotes_audit_log l "
                        +
                        "LEFT JOIN lotes lop ON lop.id = l.lote_padre_id " +
                        "JOIN lotes lo ON lo.id = l.id " +

                        "JOIN cultivares c ON lo.cultivar_id = c.id " +
                        "LEFT JOIN categorias ca ON lop.categoria_id = ca.id " +
                        "WHERE l.rev = (SELECT l2.rev FROM lotes_audit_log l2 WHERE l2.id = l.id ORDER BY l2.cantidad DESC LIMIT 1) "
                        +
                        "AND l.fecha BETWEEN :fechaDesde AND :fechaHasta " +
                        "AND lo.deleted = false " +
                        "AND lo.categoria_id = :categoriaId", nativeQuery = true)
        List<Object[]> findLotesByCategoriaWithTotalCantidad(@Param("categoriaId") Long categoriaId,

                        @Param("fechaDesde") LocalDate fechaDesde,
                        @Param("fechaHasta") LocalDate fechaHasta);

        @Query("SELECT l.id, l, v, COALESCE(SUM(ls.cantidad), 0) AS totalCantidad FROM Lote l " +
                        "JOIN l.procesos p " +
                        "JOIN p.valores v " +
                        "LEFT JOIN l.subLotes ls " +
                        "WHERE ((l.fechaDeBaja IS NULL AND l.fecha <= :localDate) " +
                        "OR (l.fechaDeBaja IS NOT NULL AND l.fecha <= :localDate AND l.fechaDeBaja >= :localDate)) " +
                        "AND v.atributo.id IN :listaAtributos AND l.categoria = :categoria AND ls.fecha<= :localDate GROUP BY 3,2,1")
        List<Object[]> findLotesAndValoresByAtributosAndCategoria(
                        @Param("listaAtributos") List<Long> listaAtributos,
                        @Param("categoria") Categoria categoria,
                        @Param("localDate") LocalDate localDate);

}
