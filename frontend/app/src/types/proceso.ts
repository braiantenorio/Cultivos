import { Atributo } from "./atributo";
import { Valor } from "./valor";

export type Proceso = {
  id: number;
  nombre: string;
  descripcion: string;
  valores: Valor[];
};
