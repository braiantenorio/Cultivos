package unpsjb.labprog.backend.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Procesos")
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
public class Proceso {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotAudited
	@ManyToOne
	@JoinColumn(name = "usuario_id", nullable = true) //TODO: como todavia no
	// implementamos usuarios, lo dejamos como opcional xd
	Usuario usuario;

	// @Column(nullable = false)
	private LocalDate fecha;

	@NotAudited
	@OneToMany(cascade = CascadeType.ALL)
	private List<Valor> valores;

	@JsonIgnore
	@ManyToMany(mappedBy = "procesos")
	List<Lote> lotes = new ArrayList<>();;

	@NotAudited
	@ManyToOne
	private ListaDeAtributos listaDeAtributos;

	@PrePersist
	public void prePersist() {
		fecha = LocalDate.now();
	}

}
