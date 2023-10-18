package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.DTOs.CategoriaDTO;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Categoria;

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

	public List<Categoria> findAllCategorias() {
		return repository.findAllCategorias();
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

	public List<Categoria> findLotesActivosByCategoria(long id) {
		return repository.findLotesActivosByCategoria(id);
	}
}