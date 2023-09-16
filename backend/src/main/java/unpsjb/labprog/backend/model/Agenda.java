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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Agenda {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@OneToOne
    @JoinColumn(name = "categoria_id") 
    private Categoria categoria;

    private LocalDate fechaInicio;

    @OneToMany
    private Collection<ProcesoProgramado> procesosProgramado;


}