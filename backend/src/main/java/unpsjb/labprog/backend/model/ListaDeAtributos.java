package unpsjb.labprog.backend.model;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

	@OneToMany(mappedBy = "listaDeAtributos")
	private List<Atributo> atributos;

	@Column(unique = true)
	private String nombre;

	/*
	 * @ManyToOne
	 * 
	 * @JoinColumn(name = "Proceso_id")
	 * private Proceso proceso;
	 * 
	 * @ManyToOne
	 * 
	 * @JoinColumn(name = "Atributo_id")
	 * private Atributo atributo;
	 */
}
