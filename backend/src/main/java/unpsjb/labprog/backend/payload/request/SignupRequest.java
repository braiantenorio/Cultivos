package unpsjb.labprog.backend.payload.request;

import java.util.Set;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
 
@Setter
@Getter
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
 
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 50)
    private String nombre;

    @NotBlank
    @Size(max = 50)
    private String apellido;
    
    private Set<String> role;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
  

}