import { Agenda } from "./agenda";
import { Categoria } from "./categoria";

export type Lote = {
  id: number;
  codigo: string;
  cantidad: number;
  categoria: Categoria;
  lotePadre: Lote;
  agenda: Agenda;
};
