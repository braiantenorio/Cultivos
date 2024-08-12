package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Categoria;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface CategoriaRepository extends CrudRepository<Categoria, Long>,
        PagingAndSortingRepository<Categoria, Long> {
    @Query("SELECT c FROM Lote l JOIN l.categoria c WHERE l.fechaDeBaja IS NULL AND l.categoria.id=:id ")
    List<Categoria> findLotesActivosByCategoria(long id);

    @Query("SELECT c FROM Categoria c WHERE c.deleted=?1 ")
    List<Categoria> findAllCategorias(boolean filtered);

    @Query("SELECT l.nombre FROM Categoria l WHERE UPPER(l.nombre) LIKE CONCAT('%', UPPER(?1), '%') ")
    List<String> search(String term);
}
