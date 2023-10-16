package unpsjb.labprog.backend.DTOs.informe;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Categoria;

@Getter
@Setter
@NoArgsConstructor
public class DDJJDTO {

    private Categoria categoria;
    private List<Atributo> atributos;
    private List<LoteDDJJDTO> lotesDDJJ;
}
