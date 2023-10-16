package unpsjb.labprog.backend.DTOs.informe;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Valor;

@Getter
@Setter
@NoArgsConstructor
public class LoteDDJJDTO {

    private String codigo;
    private LocalDate fecha;
    private String variedad;
    private int cantidad;
    private String codigoPadre;
    private String categoriaPadre;
    private List<Valor> valores = new ArrayList<>();

    public void addValor(Valor valor) {
        valores.add(valor);
    }
}
