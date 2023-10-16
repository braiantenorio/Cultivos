import { Atributo } from "./atributo";
import { LoteStock } from "./loteStock";

export type Stock = {
  atributos: Atributo[];
  lotesStock: LoteStock[];
};
