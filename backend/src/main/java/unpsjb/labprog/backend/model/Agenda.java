package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;
import java.time.LocalDate;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Collection;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Audited( targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
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