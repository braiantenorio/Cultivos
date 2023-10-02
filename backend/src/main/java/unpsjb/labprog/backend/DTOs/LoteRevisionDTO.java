package unpsjb.labprog.backend.DTOs;

import java.util.Date;
import unpsjb.labprog.backend.model.Lote;

public class LoteRevisionDTO {
    private Lote entidad;
    private Date revisionDate;

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
}
