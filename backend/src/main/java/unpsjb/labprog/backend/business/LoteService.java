package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import unpsjb.labprog.backend.model.Lote;

@Service
public class LoteService {

	@Autowired
	LoteRepository repository;

	@Autowired
    private EntityManager entityManager;

	//TODO: Mejorar
	public List<Lote> findAll() {
		List<Lote> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public List<Lote> findAllActivos() {

		return repository.findAllActivos();
	}

 	//find all con filtro de lotes con softdelete
	public Iterable<Lote> findAll(boolean isDeleted,String term){
		Session session = entityManager.unwrap(Session.class);

    session.enableFilter("deletedLoteFilter")
        .setParameter("isDeleted", false)
        .setParameter("codigo", "%" + term + "%");

        Iterable<Lote> products =  repository.findAll();
        session.disableFilter("deletedLoteFilter");

        return products;
	}

	public Lote findById(long id) {
        return repository.findById(id).orElse(null);
	}

	public Lote findByCode(String code) {
        return repository.findByCode(code).orElse(null);
    }
	public int calculateTotalCantidadSublotes(long lotePadreId){
		return repository.calculateTotalCantidadSublotes(lotePadreId);
	}

	@Transactional
	public Lote update(Lote lote) {
		return repository.save(lote);
	}

   @Transactional
    public Lote add(Lote lote) {

        return repository.save(lote);
    }

	public void delete(Long id){
		repository.deleteById(id);
	}

}
