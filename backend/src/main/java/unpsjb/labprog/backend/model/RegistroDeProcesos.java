package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;

import java.time.LocalDate;

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
@Table(name = "Registro_de_procesos")
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
    Usuario usuario;

}
