package unpsjb.labprog.backend.model;

import java.time.LocalDate;
import java.util.List;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Audited
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Lotes")
@SQLDelete(sql = "UPDATE Lotes SET deleted = true WHERE id=?")
@FilterDef(name = "deletedLoteFilter", parameters = @ParamDef(name = "isDeleted", type = boolean.class))
@Filter(name = "deletedLoteFilter", condition = "deleted = :isDeleted")
public class Lote {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false, unique = true)
	private String codigo;

	@Column(nullable = false)
	private int cantidad;

	@NotAudited
	@ManyToOne
	@JoinColumn(name = "categoria_id", nullable = false)
	private Categoria categoria;

	@NotAudited
	@OneToOne
	@JoinColumn(name = "agenda_id")
	private Agenda agenda;

	private boolean deleted = Boolean.FALSE;

	private boolean esHoja = Boolean.TRUE; // Cuando lo creamos es activo no?

	private LocalDate fechaDeCreacion; // cuando se cree poner la fecha del dia

	@ManyToOne(fetch = FetchType.LAZY)
	private Lote lotePadre;

	@OneToMany(mappedBy = "lotePadre")
	private List<Lote> subLotes;

	@NotAudited
	@ManyToOne
	private Usuario usuario;

	@ManyToMany
	@JoinTable(name = "Registro_de_procesos",
		joinColumns = @JoinColumn(name = "lote_id"), 
		inverseJoinColumns = @JoinColumn(name = "proceso_id"))
	List<Proceso> procesos;
}
