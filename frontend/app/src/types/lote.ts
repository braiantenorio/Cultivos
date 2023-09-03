import { Categoria } from "./categoria";

export type Lote = {
	id: number;
	codigo: string;
	cantidad: number;
	categoria: Categoria
}

