import { DDJJ } from "./ddjj";
import { Stock } from "./stock";

export type Informe = {
  stock: Stock;
  ddjjs: DDJJ[];
  fechaDesde: string;
  fechaHasta: string;
};
