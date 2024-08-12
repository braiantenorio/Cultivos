package unpsjb.labprog.backend.business;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unpsjb.labprog.backend.model.ListaDeAtributos;

import org.springframework.data.repository.PagingAndSortingRepository;

@Repository
public interface ListaDeAtributosRepository extends CrudRepository<ListaDeAtributos, Long>,
        PagingAndSortingRepository<ListaDeAtributos, Long> {

    @Query("SELECT l FROM ListaDeAtributos l WHERE UPPER(l.nombre) = UPPER(?1)")
    Optional<ListaDeAtributos> findByNombre(String code);

    @Query("SELECT l.nombre FROM ListaDeAtributos l WHERE UPPER(l.nombre) LIKE CONCAT('%', UPPER(?1), '%') ")
    List<String> search(String term);

    @Query("SELECT l FROM ListaDeAtributos l WHERE UPPER(l.nombre) LIKE CONCAT('%', UPPER(?1), '%') ")
    List<ListaDeAtributos> findAll(String term);

}
