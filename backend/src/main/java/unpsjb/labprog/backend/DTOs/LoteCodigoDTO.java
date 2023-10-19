package unpsjb.labprog.backend.DTOs;

import unpsjb.labprog.backend.model.Proceso;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LoteCodigoDTO {
    private Proceso proceso;
    private List<String> lotesCodigos;

}