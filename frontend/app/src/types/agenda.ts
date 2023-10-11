import { ProcesoProgramado } from "./procesoProgramado";
import { TipoAgenda } from "./tipoAgenda";

export type Agenda = {
  id: number;
  tipoAgenda: TipoAgenda;
  procesosProgramado: ProcesoProgramado[];
};
