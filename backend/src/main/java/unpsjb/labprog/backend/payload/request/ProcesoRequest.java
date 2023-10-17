package unpsjb.labprog.backend.payload.request;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.ListaDeAtributos;
import unpsjb.labprog.backend.model.Usuario;

@Getter
@Setter
public class ProcesoRequest {

    private Long id;

    private Usuario usuario;

    private LocalDate fecha;

    private List<ValorRequest> valores = new ArrayList<>();

	private ListaDeAtributos listaDeAtributos;
   
}
