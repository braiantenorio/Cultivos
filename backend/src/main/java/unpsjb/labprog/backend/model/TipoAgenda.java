package unpsjb.labprog.backend.model;

import java.util.Collection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor

public class TipoAgenda {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@ManyToOne
	private Categoria categoria;

	private String version;

	@OneToMany(cascade = CascadeType.ALL)
	private Collection<ProcesoProgramado> procesosProgramado;

	private boolean deleted = Boolean.FALSE;

}