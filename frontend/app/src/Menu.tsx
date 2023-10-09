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
  useNavigate,
} from "react-router-dom";
import icono from "./assets/img/icono.png";

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
  const { notifications, updateNotifications } = useNotifications();

  const toggleNotifications = () => {
    updateNotifications(0, []);
  };

  useEffect(() => {
    fetch(`/lotes/procesosPendientes`)
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
      <ul></ul>

      <Link
        to="/agenda/general"
        className="btn btn-custom-color-2 position-relative rounded-circle"
        onClick={toggleNotifications}
      >
        <i className="bi bi-bell-fill custom-icon bi-lg"></i>

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
