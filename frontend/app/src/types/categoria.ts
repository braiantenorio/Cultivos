export type Categoria = {
  id: number;
  codigo: number;
  nombre: string;
  subCategorias: Categoria[];
  deleted: boolean;
};
