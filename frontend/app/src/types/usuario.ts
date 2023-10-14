export default interface Usuario {
    id?: any | null,
    username: string,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    roles?: Array<string>
  }