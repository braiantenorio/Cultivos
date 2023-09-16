import { Atributo } from "./atributo";

export interface Valor {
    id: number | null;
    atributo: Atributo;
    valor: string | null;
  };
  