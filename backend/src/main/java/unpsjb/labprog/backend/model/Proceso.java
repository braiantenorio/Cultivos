package unpsjb.labprog.backend.model;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Procesos")
@Audited
public class Proceso {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotAudited
	@ManyToOne
	@JoinColumn(name = "usuario_id", nullable = false)
	Usuario usuario;

	@Column(nullable = false)
	private LocalDate fecha;

	@NotAudited
	@OneToMany(mappedBy = "proceso", cascade = CascadeType.ALL)
	private List<Valor> valores;

	@ManyToMany(mappedBy = "procesos")
	List<Lote> lotes;

	@NotAudited
	@ManyToOne
	private ListaDeAtributos listaDeAtributos;

}
