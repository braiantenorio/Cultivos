package unpsjb.labprog.backend.DTOs;

import java.util.Date;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Usuario;

public class LoteRevisionDTO {
    private Lote entidad;

    private Date revisionDate;

    private Usuario usuario;

    public Lote getEntidad() {
        return entidad;
    }

    public void setEntidad(Lote entidad) {
        this.entidad = entidad;
    }

    public Date getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(Date revisionDate) {
        this.revisionDate = revisionDate;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }
}
