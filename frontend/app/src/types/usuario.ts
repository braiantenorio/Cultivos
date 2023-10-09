export default interface Usuario {
    id?: any | null,
    username: string,
    email: string,
    password: string,
    roles?: Array<string>
  }