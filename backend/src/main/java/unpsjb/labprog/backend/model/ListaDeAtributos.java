package unpsjb.labprog.backend.model;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Lista_de_atributos")
public class ListaDeAtributos {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(unique = true)
	private String nombre;

	@ManyToMany
	@JoinTable(name = "listas_atributos",
		joinColumns = @JoinColumn(name = "lista_id"),
		inverseJoinColumns = @JoinColumn(name = "atributo_id"))
	private List<Atributo> atributos;

}
