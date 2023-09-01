package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RegistroDeProcesos {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "lote_id", nullable = false)
    Lote lote;

    @ManyToOne
    @JoinColumn(name = "proceso_id", nullable = false)
    Proceso proceso;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    Proceso usuario;

}
