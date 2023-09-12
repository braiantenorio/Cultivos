package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ProcesoProgramado {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private LocalDate fechaARealizar;
    //frecuencia cada 5 dias y se realiza 3 veces  (5  10  15)    
    private int dia;

    private Boolean completado;
    
    @OneToOne
    @JoinColumn(name = "proceso_id") 
    private Proceso proceso;
}