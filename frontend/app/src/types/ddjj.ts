import { Atributo } from "./atributo";
import { Categoria } from "./categoria";
import { LoteDDJJ } from "./loteDDJJ";

export type DDJJ = {
  categoria: Categoria;
  atributos: Atributo[];
  lotesDDJJ: LoteDDJJ[];
};
