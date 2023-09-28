// App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Loteslist from "./components/LotesList";
import EditarLote from "./components/EditarLote";
import "./App.css";
import CrearLote from "./components/CrearLote";
import DetalleLote from "./components/DetalleLote";
import CrearProceso from "./components/CrearProceso";
import AgendaDeProcesos from "./components/AgendaDeProcesos";
import DetalleProceso from "./components/DetalleProceso";
import icono from "./assets/img/icono.png";
import fondo from "./assets/img/cannabis.png";
import CrearAgenda from "./components/CrearAgenda";
import TipoAgendaList from "./components/TipoAgendaList";
import CrearAtributo from "./components/CrearAtributo";

//import { NotificationList } from "./components/NotificationList";
import { Notificacion } from "./types/notificacion";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/lotes/crear-lote" element={<CrearLote />} />
        <Route path="/lotes" element={<Loteslist />} />
        <Route path="/lotes/:loteId/edit" element={<EditarLote />} />
        <Route path="/lotes/:loteId" element={<DetalleLote />} />
        <Route path="/lotes/:loteId/procesos/:listId/new" element={<CrearProceso />} />
        <Route path="/lotes/:loteId/agenda" element={<AgendaDeProcesos />} />
        <Route path="/procesos/:procesoId" element={<DetalleProceso />} />
        <Route path="/agendas/:id" element={<CrearAgenda />} />
        <Route path="/agendas" element={<TipoAgendaList />} />
        <Route path="/atributos/new" element={<CrearAtributo />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="container text-center mt-5">
      <h2 className=" titulo-personalizado">
        Sistema de Gestión y Control en la producción de Cannabis medicinal
      </h2>

      <div className="my-4">
        <img src={fondo} alt="Cannabis Medicinal" className="img-fluid" />
      </div>
    </div>
  );
}

function Menu() {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  const markAsRead = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);

    const notificationId = updatedNotifications[index].id;
    fetch(`/notificaciones/${notificationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navigate = useNavigate();
  const navigateToLink = (link: string) => {
    const llink = "/lotes/" + link;
    navigate(llink);
  };
  useEffect(() => {
    fetch(`/usuarios/id/1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        const reversedNotifications =
          responseData.data.notificaciones.reverse();
        setNotifications(reversedNotifications);
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
      <div className="navbar-brand bg-light p-3 rounded-circle">
        <img src={icono} alt="" width="30" height="25" />
      </div>
      <ul></ul>
      <div className="dropdown ">
        <button
          className="btn dropdown-toggle "
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
          className="btn dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Procesos
        </button>

        <ul className="dropdown-menu  border border-dark border-2 ">
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
          className="btn  dropdown-toggle "
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
          className="btn dropdown-toggle "
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Categorias
        </button>

        <ul className="dropdown-menu  border border-dark border-2 ">
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
      {/*
      <div>
        <NotificationList
          notifications={notifications}
          markAsRead={markAsRead}
          navigateToLink={navigateToLink}
        />
      </div>
      */}
      <nav className="my-2 my-md-0 ms-auto ">
        <Link className="p-2 text-black " to="/">
          Home
        </Link>
      </nav>
    </div>
  );
}

export default App;
