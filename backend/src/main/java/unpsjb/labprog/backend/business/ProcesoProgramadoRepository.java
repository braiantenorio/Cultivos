package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.ProcesoProgramado;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcesoProgramadoRepository extends CrudRepository<ProcesoProgramado, Long> {

        @Query("SELECT u.email AS email, u.nombre AS nombreUsuario, l.codigo AS codigoLote, pp.proceso AS proceso " +
                        "FROM Lote l " +
                        "JOIN l.agenda a " +
                        "JOIN a.procesosProgramado pp " +
                        "JOIN l.usuario u " +
                        "WHERE pp.fechaARealizar = :fechaMañana " +
                        "ORDER BY u.email ")
        List<Object[]> findProcesosProgramadosParaMañana(LocalDate fechaMañana);

        @Query("SELECT pp " +
                        "FROM Lote l " +
                        "JOIN l.agenda a " +
                        "JOIN a.procesosProgramado pp " +
                        "WHERE pp.proceso.nombre = :proceso AND l.codigo = :lote AND pp.completado = false ORDER BY pp.fechaARealizar ASC ")
        List<ProcesoProgramado> findProcesoProgramado(String lote, String proceso);

        @Query("SELECT  l.codigo AS codigoLote, pp AS proceso " +
                        "FROM Lote l " +
                        "JOIN l.agenda a " +
                        "JOIN a.procesosProgramado pp " +
                        // "JOIN l.usuario u " +
                        "WHERE pp.fechaARealizar <= :fecha AND pp.completado = false " +
                        "AND (UPPER(l.codigo) LIKE CONCAT('%', UPPER(:term), '%') " +
                        "OR UPPER(pp.proceso.nombre)  LIKE CONCAT('%', UPPER(:term), '%')) " +
                        "ORDER BY pp.fechaARealizar ASC ")
        List<Object[]> findProcesosProgramadosPendientes(LocalDate fecha, String term);
}