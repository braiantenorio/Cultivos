package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;

import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE Atributos SET deleted = true WHERE id=?")
@Table(name = "Atributos")
public class Atributo {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "Nombre")
	private String nombre;

	@Column(name = "Tipo")
	private String tipo;

	private int maximo;

	private int minimo;

	private int decimales;

	private int caracteres;

	private boolean obligatorio;

	private boolean deleted = Boolean.FALSE;

}
