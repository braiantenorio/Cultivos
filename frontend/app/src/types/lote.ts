import { Agenda } from "./agenda";
import { Categoria } from "./categoria";
import { Proceso } from "./proceso";

export type Lote = {
  id: number;
  codigo: string;
  cantidad: number;
  categoria: Categoria;
  lotePadre: Lote;
  agenda: Agenda;
  procesos: Proceso[];
  deleted: boolean;
  esHoja: boolean;
};
