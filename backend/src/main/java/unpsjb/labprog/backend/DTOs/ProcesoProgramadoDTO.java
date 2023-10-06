package unpsjb.labprog.backend.DTOs;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.ListaDeAtributos;
import java.time.LocalDate;

@Getter
@Setter
public class ProcesoProgramadoDTO {
 
    private String lote;
    private ListaDeAtributos proceso;
    private LocalDate fechaARealizar;
    private Boolean completado;

    public ProcesoProgramadoDTO(String lote,ListaDeAtributos  proceso,LocalDate fechaARealizar,Boolean completado) {
        this.lote = lote;
        this.proceso = proceso;
        this.fechaARealizar=fechaARealizar;
        this.completado= completado;
    }
}