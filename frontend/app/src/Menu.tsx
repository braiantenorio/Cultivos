import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import icono from "./assets/img/icono.png";
import Usuario from "./types/usuario";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import EventBus from "./common/EventBus";
import * as AuthService from "./services/auth.service";
import authHeader from "./services/auth-header";

type NotificationsContextType = {
  notifications: number;
  notificationMessages: string[];
  updateNotifications: (
    newNotificationCount: number,
    newMessages: string[]
  ) => void;
};

export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: 0,
  notificationMessages: [],
  updateNotifications: (newNotificationCount, newMessages) => {},
});

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState(0);
  const [notificationMessages, setNotificationMessages] = useState<string[]>(
    []
  );

  const updateNotifications = (
    newNotificationCount: number,
    newMessages: string[]
  ) => {
    setNotifications(newNotificationCount);
    setNotificationMessages(newMessages);
  };
  const updateMensajes = (newMessages: string[]) => {
    setNotificationMessages(newMessages);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, notificationMessages, updateNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};

function Menu() {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  const navigate = useNavigate();
  const navigateToLink = (link: string) => {
    const llink = "/lotes/" + link;
    navigate(llink);
  };

  const { notifications, updateNotifications } = useNotifications();

  const toggleNotifications = () => {
    updateNotifications(0, []);
  };

  useEffect(() => {
    fetch(`/lotes/procesosPendientes?term=&dia=0`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        //  setNotifications(responseData.data.length);
        updateNotifications(responseData.data.length, []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (isLoginPage) {
    return null; // No renderizar la barra de navegación en /login o /register
  }
  return (
    <div
      className="d-flex flex-column flex-md-row align-items-center p-1 px-md-4 mb-3 
    custom text-black border-bottom shadow-sm border border-dark border-1 "
    >
      <div>
        <img src={icono} alt="" width="60" height="60" />
      </div>
      <ul></ul>
      <div>
        {" "}
        <Link to="/" className="btn btn-custom-color-2">
          Home
        </Link>
      </div>
      <ul></ul>
      <div className="dropdown ">
        <button
          className="btn btn-custom-color-2 dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Lotes
        </button>

        <ul className="dropdown-menu border  border-dark border-2 ">
          <li>
            <Link className="dropdown-item" to="/lotes">
              Listar
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/lotes/crear-lote">
              Nuevo
            </Link>
          </li>
        </ul>
      </div>
      <ul></ul>
      <div className="dropdown">
        <button
          className="btn btn-custom-color-2 dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Procesos
        </button>

        <ul className="dropdown-menu  border border-dark border-2 ">
          <li>
            <Link className="dropdown-item" to="/atributos">
              Atributos
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/atributos/new">
              Nuevo atributo
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/tipo-proceso">
              Tipos de procesos
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/tipo-proceso/new">
              Nuevo tipo de proceso
            </Link>
          </li>
        </ul>
      </div>
      <ul></ul>
      <div className="dropdown">
        <button
          className="btn btn-custom-color-2 dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Agendas
        </button>

        <ul className="dropdown-menu border border-dark border-2 ">
          <li>
            <Link className="dropdown-item" to="/agendas">
              Listar
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/agendas/new">
              Nuevo
            </Link>
          </li>
        </ul>
      </div>
      <ul></ul>
      <div className="dropdown">
        <button
          className="btn btn-custom-color-2 dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Categorias
        </button>

        <ul className="dropdown-menu border border-dark border-2 ">
          <li>
            <Link className="dropdown-item" to="/categorias">
              Listar
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/categorias/new">
              Nuevo
            </Link>
          </li>
        </ul>
      </div>
      <ul></ul>
      <div>
        {" "}
        <Link to="/generar/informe" className="btn btn-custom-color-2">
          Informes
        </Link>
      </div>
      <ul></ul>
      {showModeratorBoard && (
        <li className="nav-item">
          <Link to={"/mod"} className="nav-link">
            Moderator Board
          </Link>
        </li>
      )}

      {showAdminBoard && (
        <li className="nav-item">
          <Link to={"/admin"} className="nav-link">
            Admin Board
          </Link>
        </li>
      )}

      {currentUser && (
        <li className="nav-item">
          <Link to={"/user"} className="nav-link">
            User
          </Link>
        </li>
      )}

      {currentUser ? (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/profile"} className="nav-link">
              {currentUser.username}
            </Link>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={logOut}>
              Cerrar sesion
            </a>
          </li>
        </div>
      ) : (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/login"} className="nav-link">
              Iniciar sesion
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/register"} className="nav-link">
              Registrarse
            </Link>
          </li>
        </div>
      )}
      <ul></ul>

      <Link
        to="/agenda/general"
        className="btn btn-custom-color-2 position-relative rounded-circle"
        onClick={toggleNotifications}
      >
        <i className="bi bi-journal custom-icon bi-lg"></i>

        {notifications > 0 && (
          <span
            className="position-absolute  translate-middle badge rounded-pill bg-danger"
            style={{ left: "35px", top: "6px" }}
          >
            {notifications}
          </span>
        )}
      </Link>
    </div>
  );
}
export default Menu;
