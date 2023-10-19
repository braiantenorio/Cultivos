package unpsjb.labprog.backend.DTOs;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Categoria;

@Getter
@Setter
public class CategoriaDTO {
    private Long id;

    private String nombre;

    private String codigo;

    private Boolean limite;

    private List<Categoria> subCategorias;

    private boolean deleted = Boolean.FALSE;

    public CategoriaDTO(Categoria categoria) {
        this.id = categoria.getId();
        this.nombre = categoria.getNombre();
        this.codigo = categoria.getCodigo();
        this.limite = categoria.getLimite();
        this.subCategorias = categoria.getSubCategorias();
    }

}
