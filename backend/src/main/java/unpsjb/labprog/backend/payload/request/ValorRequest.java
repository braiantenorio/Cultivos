package unpsjb.labprog.backend.payload.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Atributo;

@Getter
@Setter
public class ValorRequest {

    private Long id;

    private Atributo atributo;

    private String valor;

    private MultipartFile imagen;

}