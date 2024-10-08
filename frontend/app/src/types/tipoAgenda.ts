import { Categoria } from "./categoria";
import { ProcesoProgramado } from "./procesoProgramado";

export type TipoAgenda = {
  id: number;
  categoria: Categoria;
  version: string;
  deleted: boolean;
  procesosProgramado: ProcesoProgramado[];
};
