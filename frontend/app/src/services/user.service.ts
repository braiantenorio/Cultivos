import axios from "axios";
import authHeader from "./auth-header";
import Usuario from "../types/usuario";

const API_URL =  process.env.REACT_APP_API_URL;

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
  return axios.get(API_URL + "/usuarios/board", { headers: authHeader() })
  .then(response => response.data.data);
}

export const changeRole = (id: string, role: string): Promise<Usuario> => {
  return axios.post(API_URL + "/usuarios/id/" + id + "/role/" + role, null, {
    headers: authHeader(),
  })
  .then(response => response.data.data);
}