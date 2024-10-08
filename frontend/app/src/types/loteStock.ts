import { Valor } from "./valor";

export type LoteStock = {
  codigo: string;
  variedad: string;
  cantidad: number;
  cantidadActual: number;
  categoria: string;
  valores: Valor[];
};
