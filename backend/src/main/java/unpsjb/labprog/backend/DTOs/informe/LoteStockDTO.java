package unpsjb.labprog.backend.DTOs.informe;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Valor;

@Getter
@Setter
@NoArgsConstructor
public class LoteStockDTO {

    private String codigo;
    private String variedad;
    private int cantidad;
    private int cantidadActual;
    private String categoria;
    private List<Valor> valores = new ArrayList<>();

    public void addValor(Valor valor) {
        valores.add(valor);
    }
}
