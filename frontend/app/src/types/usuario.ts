import { Role } from "./role"

export default interface Usuario {
    id?: any | null,
    username: string,
    nombre: string,
    apellido: string,
    email: string,
    roles?: Array<Role>
  }