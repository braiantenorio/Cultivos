export interface ResultsPage<T> {
  content: T[];
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}
