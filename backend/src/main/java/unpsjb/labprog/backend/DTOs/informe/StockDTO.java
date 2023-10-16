package unpsjb.labprog.backend.DTOs.informe;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Atributo;

@Getter
@Setter
@NoArgsConstructor
public class StockDTO {

    private List<Atributo> atributos;
    private List<LoteStockDTO> lotesStock;
}
