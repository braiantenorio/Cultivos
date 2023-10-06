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
import LoteRevisiones from "./components/LoteRevisionComponent";
import ListarAtributos from "./components/ListarAtributos";
import ListarTiposDeProcesos from "./components/ListarTiposDeProcesos";
import VerHistoriaLote from "./components/VerHistoriaLote";
import AgendaGeneralDeProcesos from "./components/AgendaGeneralDeProcesos";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/lotes/crear-lote" element={<CrearLote />} />
        <Route path="/lotes" element={<Loteslist />} />
        <Route path="/lotes/:loteId/edit" element={<EditarLote />} />
        <Route path="/lotes/:loteId" element={<DetalleLote />} />
        <Route path="/lotes/log/:loteId" element={<LoteRevisiones />} />
        <Route path="/lotes/:loteId/historia" element={<VerHistoriaLote />} />
        <Route
          path="/lotes/:loteId/procesos/:listId"
          element={<CrearProceso />}
        />
        <Route path="/lotes/:loteId/agenda" element={<AgendaDeProcesos />} />
        <Route path="/procesos/:procesoId" element={<DetalleProceso />} />
        <Route path="/agendas/:id" element={<CrearAgenda />} />
        <Route path="/agendas" element={<TipoAgendaList />} />
        <Route path="/agenda/general" element={<AgendaGeneralDeProcesos />} />
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
  const [notifications, setNotifications] = useState(0);

  const toggleNotifications = () => {
    setNotifications(0);
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
        setNotifications(responseData.data.length);
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
export default App;
