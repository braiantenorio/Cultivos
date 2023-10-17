import { Lote } from "./lote";
import Usuario from "./usuario";

export type LoteRevision = {
  entidad: Lote;
  revisionDate: Date;
  usuario: Usuario;
};
