package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Categoria;
import unpsjb.labprog.backend.model.Lote;

@Service
public class CategoriaService {

	@Autowired
	CategoriaRepository repository;

	// TODO: Mejorar
	public List<Categoria> findAll() {
		List<Categoria> result = new ArrayList<>();
		repository.findAll().forEach(e -> result.add(e));
		return result;
	}

	public Categoria findByCode(String code) {
		return repository.findByCode(code).orElse(null);
	}

	public List<Categoria> findAllCategorias(boolean filtered) {
		return repository.findAllCategorias(filtered);
	}

	public Categoria findById(long id) {
		return repository.findById(id).orElse(null);
	}

	@Transactional
	public Categoria add(Categoria atributo) {
		return repository.save(atributo);
	}

	@Transactional
	public Categoria update(Categoria lote) {
		return repository.save(lote);
	}

	public void delete(Long id) {
		Categoria categoriaAEliminar = repository.findById(id).orElse(null);

		if (categoriaAEliminar != null) {

			List<Categoria> categoriasConSubcategoria = findAll();
			for (Categoria categoria : categoriasConSubcategoria) {

				if (categoria.getSubCategorias().contains(categoriaAEliminar)) {
					categoria.getSubCategorias().remove(categoriaAEliminar);
				}
				categoria.getSubCategorias().remove(categoriaAEliminar);
			}

			repository.saveAll(categoriasConSubcategoria);

			repository.delete(categoriaAEliminar);
		}
	}

	public List<String> search(String term) {
		return repository.search("%" + term + "%");
	}

	public List<Categoria> findLotesActivosByCategoria(long id) {
		return repository.findLotesActivosByCategoria(id);
	}

	public Page<Categoria> findByPage(List<Categoria> clientes, int page, int size) {
		int start = page * size;
		int end = Math.min(start + size, clientes.size());
		Page<Categoria> clientesPage = new PageImpl<>(clientes.subList(start, end), PageRequest.of(page, size),
				clientes.size());
		return clientesPage;
	}
}