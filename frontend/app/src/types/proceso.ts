import { Atributo } from "./atributo";
import { TipoDeProceso } from "./tipoDeProceso";
import Usuario from "./usuario";
import { Valor } from "./valor";

export type Proceso = {
  id: number | null;
  usuario: Usuario | null;
  fecha: Date | null;
  valores: Valor[];
  listaDeAtributos: TipoDeProceso;
  deleted: boolean;
};
