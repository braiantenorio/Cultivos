package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import unpsjb.labprog.backend.model.Atributo;

@Repository
public interface AtributoRepository extends CrudRepository<Atributo, Long>, PagingAndSortingRepository<Atributo, Long> {

    @Query("SELECT c FROM ListaDeAtributos l JOIN l.atributos c WHERE c.id=:id ")
    List<Atributo> findTipoDeProcesosByAtributo(long id);

    @Query("SELECT c FROM Atributo c WHERE c.deleted=?1 ")
    List<Atributo> findAllAtributos(boolean filtered);
}