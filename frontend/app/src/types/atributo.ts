
export type Atributo = {
	id: number;
	nombre: string; 
    tipo: string;
    obligatorio: boolean;
    limiteCaracteres: number;
    rangoMinimo?: number;
    rangoMaximo?: number;
    limiteDecimales?: number;
}