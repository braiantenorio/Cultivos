package unpsjb.labprog.backend.DTOs;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Proceso;
import unpsjb.labprog.backend.model.Usuario;

@Getter
@Setter
public class LoteRevisionDTO {
    private Lote entidad;

    private Date revisionDate;

    private Usuario usuario;

    private List<Proceso> procesos;

}
