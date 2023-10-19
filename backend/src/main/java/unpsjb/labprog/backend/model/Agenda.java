package unpsjb.labprog.backend.model;

import java.util.List;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Agenda {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	// @JsonIgnore
	@ManyToOne
	private TipoAgenda tipoAgenda;

	@OneToMany
	private List<ProcesoProgramado> procesosProgramado = new ArrayList<>();

	public void addprocesoProgramado(ProcesoProgramado procesoProgramado) {
		procesosProgramado.add(procesoProgramado);
	}

}