import { ProcesoProgramado } from "./procesoProgramado";

export type TipoAgenda = {
  id: number;
  categoria: string;
  version: string;
  procesosProgramado: ProcesoProgramado[];
};
