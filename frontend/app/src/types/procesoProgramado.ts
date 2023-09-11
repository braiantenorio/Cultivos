import { Proceso } from "./proceso";

export type ProcesoProgramado = {
  id: number;
  fechaARealizar: Date;
  dia: number;
  completado: Boolean;
  proceso: Proceso;
};
