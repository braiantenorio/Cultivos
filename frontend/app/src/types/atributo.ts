
export type Atributo = {
	id: number;
	nombre: string; 
    tipo: string;
    obligatorio: boolean;
    caracteres: number;
    minimo?: number;
    maximo?: number;
    decimales?: number;
}