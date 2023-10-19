package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.List;

import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE Categorias SET deleted = true WHERE id=?")
@Table(name = "Categorias")
@JsonIgnoreProperties(value = { "subCategorias" }, allowSetters = true)
public class Categoria {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false, unique = true)
	private String codigo;

	private Boolean limite;

	@ManyToMany
	private List<Categoria> subCategorias;

	private boolean deleted = Boolean.FALSE;
}
