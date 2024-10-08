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
import BoardAdmin from "./components/BoardAdmin";

import EventBus from "./common/EventBus";
import * as AuthService from "./services/auth.service";
import authHeader from "./services/auth-header";
import AuthVerify from "./common/AuthVerify";

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

  const currentUser = AuthService.getCurrentUser();
  const location = useLocation();

  // Condición para mostrar la marca de agua solo si el usuario es moderador
  const showWatermark =
    currentUser?.roles.includes("ROLE_MODERATOR") ||
    currentUser?.roles.includes("ROLE_ADMIN") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/home" ||
    location.pathname === "/";

  return (
    <NotificationsContext.Provider
      value={{ notifications, notificationMessages, updateNotifications }}
    >
      {!showWatermark && <div className="watermark col-12">Solo Lectura</div>}
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
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";
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

  const { notifications, updateNotifications } = useNotifications();

  const toggleNotifications = () => {
    updateNotifications(0, []);
  };

  useEffect(() => {
    fetch(`/lotes/procesosPendientes?term=&dia=0&page=&size=99`, {
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
        updateNotifications(responseData.data.content.length, []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (isLoginPage) {
    return null; // No renderizar la barra de navegación en /login o /register
  }
  return (
    <nav className="navbar navbar-expand-lg  custom-navbar mb-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={icono} alt="" width="50" height="50" />
        </Link>
        &nbsp; &nbsp;
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end custom-navbar"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          tabIndex={-1}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <div className="dropdown mt-1 ">
                <button
                  className="btn btn-custom-color-2 dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Lotes
                </button>

                <ul
                  className="dropdown-menu border  border-dark border-2  w-50 "
                  data-bs-dismiss="offcanvas"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/lotes?pagina=1&longitud=7"
                    >
                      Listar
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/lotes/crear-lote">
                        Nuevo
                      </Link>
                    </li>
                  )}
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      {" "}
                      <Link to="/generar/informe" className="dropdown-item">
                        Informe
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              &nbsp;
              <ul></ul>
              <div className="dropdown mt-1 ">
                <button
                  className="btn btn-custom-color-2 dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Procesos
                </button>

                <ul
                  className="dropdown-menu  border border-dark border-2  w-125s"
                  data-bs-dismiss="offcanvas"
                >
                  <li>
                    <Link className="dropdown-item" to="/atributos">
                      Atributos
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/atributos/new">
                        Nuevo atributo
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/tipo-proceso">
                      Tipos de procesos
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/tipo-proceso/new">
                        Nuevo tipo de proceso
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              &nbsp;
              <ul></ul>
              <div className="dropdown mt-1 ">
                <button
                  className="btn btn-custom-color-2 dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Agendas
                </button>

                <ul
                  className="dropdown-menu border border-dark border-2  w-50"
                  data-bs-dismiss="offcanvas"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/agendas?pagina=1&longitud=7"
                    >
                      Listar
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/agendas/new">
                        Nuevo
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              &nbsp;
              <ul></ul>
              <div className="dropdown mt-1 ">
                <button
                  className="btn btn-custom-color-2 dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categorias
                </button>

                <ul
                  className="dropdown-menu border border-dark border-2  w-50"
                  data-bs-dismiss="offcanvas"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/categorias?pagina=1&longitud=7"
                    >
                      Listar
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/categorias/new">
                        Nuevo
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              &nbsp;
              <ul></ul>
              <div className="dropdown mt-1 ">
                <button
                  className="btn btn-custom-color-2 dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Cultivares
                </button>

                <ul
                  className="dropdown-menu border border-dark border-2  w-50"
                  data-bs-dismiss="offcanvas"
                >
                  <li>
                    <Link className="dropdown-item" to="/cultivares">
                      Listar
                    </Link>
                  </li>
                  {(showModeratorBoard || showAdminBoard) && (
                    <li>
                      <Link className="dropdown-item" to="/cultivares/new">
                        Nuevo
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              &nbsp;
              <ul></ul>
              <div className="nav-item mt-1">
                <Link to="/about">
                  <button
                    className="btn btn-custom-color-2"
                    type="button"
                    aria-expanded="false"
                    data-bs-dismiss="offcanvas"
                  >
                    Acerca de
                  </button>
                </Link>
              </div>
            </ul>
            <ul></ul>
            {(showModeratorBoard || showAdminBoard) && (
              <Link
                to="/agenda/general?pagina=1&longitud=7"
                className="btn btn-custom-color-2 position-relative rounded-circle "
                onClick={toggleNotifications}
              >
                <i
                  className="bi bi-journal custom-icon bi-lg"
                  data-bs-dismiss="offcanvas"
                ></i>
                {notifications > 0 && (
                  <span
                    className="position-absolute translate-middle badge rounded-pill bg-danger"
                    style={{ left: "35px", top: "6px" }}
                  >
                    {notifications}
                  </span>
                )}
              </Link>
            )}
            <ul></ul>
            <ul className="navbar-nav ms-auto">
              {showAdminBoard && (
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to="/admin" className="nav-link">
                    <b>Panel del administrador</b>
                  </Link>
                </li>
              )}
              {currentUser ? (
                <>
                  <li className="nav-item mt-1" data-bs-dismiss="offcanvas">
                    <Link
                      to="/profile"
                      className="btn btn-custom-color-5 rounded-pill "
                    >
                      <i className="bi bi-person "></i> {currentUser.username}
                      {/* Icono de perfil */}
                    </Link>
                  </li>
                  &nbsp;
                  <li className="nav-item mt-1">
                    <a
                      href="/login"
                      className="btn btn-custom-color-5 rounded-pill"
                      onClick={logOut}
                    >
                      <i className="bi bi-box-arrow-right"></i>{" "}
                      {/* Icono de cerrar sesión */}
                      Cerrar sesión
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mt-1">
                    <Link
                      to="/login"
                      className="btn btn-custom-color-5 rounded-pill "
                    >
                      <i className="bi bi-box-arrow-in-right"></i>{" "}
                      {/* Icono de iniciar sesión */}
                      Iniciar sesión
                    </Link>
                  </li>
                  &nbsp;
                  <li className="nav-item mt-1">
                    <Link
                      to="/register"
                      className="btn btn-custom-color-5 rounded-pill "
                    >
                      <i className="bi bi-person-plus"></i>{" "}
                      {/* Icono de registrarse */}
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <AuthVerify />
    </nav>
  );
}

export default Menu;
