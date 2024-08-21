package unpsjb.labprog.backend.DTOs;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileDTO {
    
    
    private String nombre;
    private String apellido;
    private String email;
    private String username;
    private String password;

}
