package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;
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
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Valores")
public class Valor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    /*
     * @JsonIgnore
     * 
     * @ManyToOne
     * 
     * @JoinColumn(name = "Proceso_id")
     * private Proceso proceso;
     */
    @ManyToOne
    @JoinColumn(name = "Atributo_id")
    private Atributo atributo;

    @Column(name = "Valor")
    private String valor; // You can change the data type to match your needs

}
