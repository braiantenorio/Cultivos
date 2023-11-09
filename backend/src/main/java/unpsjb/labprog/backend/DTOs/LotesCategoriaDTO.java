package unpsjb.labprog.backend.DTOs;

import unpsjb.labprog.backend.model.Lote;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LotesCategoriaDTO {

    private List<Lote> lotes;

}
