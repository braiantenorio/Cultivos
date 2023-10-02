import { TipoDeProceso } from "./tipoDeProceso";

export type ProcesoProgramado = {
  id: number;
  fechaARealizar: Date;
  frecuencia: number;
  cantidad: number;
  diaInicio: number;
  completado: Boolean;
  proceso: TipoDeProceso;
};
