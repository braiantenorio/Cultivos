package unpsjb.labprog.backend.model;

import java.util.Collection;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.CascadeType;

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