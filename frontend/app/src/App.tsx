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
import Untitled from "./assets/img/Untitled.png";
import CrearAgenda from "./components/CrearAgenda";
import TipoAgendaList from "./components/TipoAgendaList";
import CrearAtributo from "./components/CrearAtributo";
import CrearTipoDeProceso from "./components/CrearTipoDeProceso";

//import { NotificationList } from "./components/NotificationList";
import { Notificacion } from "./types/notificacion";
import ListarAtributos from "./components/ListarAtributos";
import ListarTiposDeProcesos from "./components/ListarTiposDeProcesos";
import VerHistoriaLote from "./components/VerHistoriaLote";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/lotes/crear-lote" element={<CrearLote />} />
        <Route path="/lotes" element={<Loteslist />} />
        <Route path="/lotes/:loteId/edit" element={<EditarLote />} />
        <Route path="/lotes/:loteId" element={<DetalleLote />} />
        <Route path="/lotes/:loteId/historia" element={<VerHistoriaLote />} />
        <Route
          path="/lotes/:loteId/procesos/:listId/new"
          element={<CrearProceso />}
        />
        <Route path="/lotes/:loteId/agenda" element={<AgendaDeProcesos />} />
        <Route path="/procesos/:procesoId" element={<DetalleProceso />} />
        <Route path="/agendas/:id" element={<CrearAgenda />} />
        <Route path="/agendas" element={<TipoAgendaList />} />
        <Route path="/atributos/new" element={<CrearAtributo />} />
        <Route path="/atributos" element={<ListarAtributos />} />
        <Route path="/tipo-proceso/new" element={<CrearTipoDeProceso />} />
        <Route path="/tipo-proceso" element={<ListarTiposDeProcesos />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="">
        Sistema de Gestión y Control en la producción de Cannabis medicinal
      </h1>

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
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#e2fcd6" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={Untitled} alt="" width="90" height="50" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Lotes
              </a>
              <ul className="dropdown-menu">
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
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Procesos
              </a>
              <ul className="dropdown-menu">
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
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Agendas
              </a>
              <ul className="dropdown-menu">
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
            </li>
          </ul>
          <div className="nav-item">
            <Link className="p-2 text-black " to="/">
              Home
            </Link>
          </div>
        </div>
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
    </nav>
  );
}

export default App;
