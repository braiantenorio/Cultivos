// App.tsx
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Loteslist from "./components/LotesList";
import EditarLote from "./components/EditarLote";
import logo from "./logo.svg";
import "./App.css";
import CrearLote from "./components/CrearLote";
import DetalleLote from "./components/DetalleLote";
import BuscarLote from "./components/BuscarLote";
import CrearProceso from "./components/CrearProceso";
import AgendaDeProcesos from "./components/AgendaDeProcesos";
import DetalleProceso from "./components/DetalleProceso";
import icono from "./assets/img/icono.png";
import fondo from "./assets/img/cannabis.png";
import CrearAgenda from "./components/CrearAgenda";
import TipoAgendaList from "./components/TipoAgendaList";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/lotes/buscar" element={<BuscarLote />} />
        <Route path="/lotes/crear-lote" element={<CrearLote />} />
        <Route path="/lotes" element={<Loteslist />} />
        <Route path="/lotes/:loteId/edit" element={<EditarLote />} />
        <Route path="/lotes/:loteId" element={<DetalleLote />} />
        <Route
          path="/lotes/:loteId/procesos/:listId/new"
          element={<CrearProceso />}
        />
        <Route path="/lotes/:loteId/agenda" element={<AgendaDeProcesos />} />
        <Route path="/procesos/:procesoId" element={<DetalleProceso />} />
        <Route path="/agendas/:id" element={<CrearAgenda />} />
        <Route path="/agendas" element={<TipoAgendaList />} />
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
  return (
    <div
      className="d-flex flex-column flex-md-row align-items-center p-1 px-md-4 mb-3 
  custom text-black border-bottom shadow-sm border border-dark border-1 "
    >
      <div className="navbar-brand bg-light p-3 rounded-circle">
        <img src={icono} alt="" width="60" height="50" />
      </div>
      <ul></ul>
      <div className="dropdown ">
        <button
          className="btn dropdown-toggle btn-lg"
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
          className="btn dropdown-toggle btn-lg"
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
          className="btn  dropdown-toggle btn-lg"
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
          className="btn dropdown-toggle btn-lg"
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
      <nav className="my-2 my-md-0 ms-auto ">
        <Link className="p-2 text-black " to="/">
          Home
        </Link>
      </nav>
    </div>
  );
}

export default App;
