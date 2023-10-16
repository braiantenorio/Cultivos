package unpsjb.labprog.backend.DTOs.informe;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InformeDTO {
    private StockDTO stock;
    private List<DDJJDTO> ddjjs;
}
