import axios from "axios";
import authHeader from "./auth-header";
import Usuario from "../types/usuario";

const API_URL = "";

export const getPublicContent = () => {
  return axios.get(API_URL + "/api/test/all");
};

export const getUserBoard = () => {
  return axios.get(API_URL + "/api/test/user", { headers: authHeader() });
};

export const getModeratorBoard = () => {
  return axios.get(API_URL + "/api/test/mod", { headers: authHeader() });
};

export const getAdminBoard = () => {
  return axios.get(API_URL + "/api/test/admin", { headers: authHeader() });
};

export const getUsers = (): Promise<Usuario[]> => {
  return axios
    .get(API_URL + "/usuarios/board", { headers: authHeader() })
    .then((response) => response.data.data);
};

export const changeRole = (id: string, role: string): Promise<Usuario> => {
  const url = `${API_URL}/usuarios/id/${id}/role/${role}`;
  const headers = authHeader();

  return fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json", // Ajusta el tipo de contenido según tu necesidad
    },
    body: JSON.stringify(null), // Si no necesitas enviar un cuerpo, puedes dejarlo como null
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => data.data);
};
