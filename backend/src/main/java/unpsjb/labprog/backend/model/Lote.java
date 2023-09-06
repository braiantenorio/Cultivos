package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.hibernate.envers.Audited;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

	@ManyToOne
	@JoinColumn(name = "categoria_id", nullable = false)
	private Categoria categoria;

	private boolean deleted = Boolean.FALSE;

}
