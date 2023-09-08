import { Categoria } from "./categoria";
import { ProcesoProgramado } from "./procesoProgramado";

export type Agenda = {
  id: number;
  categoria: Categoria;
  fechaInicio: Date;
  procesosProgramado: ProcesoProgramado[];
};
