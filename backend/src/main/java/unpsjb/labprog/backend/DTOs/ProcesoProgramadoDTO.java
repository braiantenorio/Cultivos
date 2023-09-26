package unpsjb.labprog.backend.DTOs;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Lote;

@Getter
@Setter
public class ProcesoProgramadoDTO {
    private String email;
    private String nombre;
    private String lote;
    private String proceso;

    public ProcesoProgramadoDTO(String email, String nombre, String lote, String proceso) {
        this.email = email;
        this.nombre = nombre;
        this.lote = lote;
        this.proceso = proceso;
    }
}