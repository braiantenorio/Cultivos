// App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lotes/buscar" element={<BuscarLote />} />
        <Route path="/lotes/crear-lote" element={<CrearLote />} />
        <Route path="/lotes" element={<Loteslist />} />
        <Route path="/lotes/:loteId/edit" element={<EditarLote />} />
        <Route path="/lotes/:loteId" element={<DetalleLote />} />
        <Route path="/lotes/:loteId/procesos/:listId/new" element={<CrearProceso />} />
        <Route path="/lotes/:loteId/agenda" element={<AgendaDeProcesos />} />
        <Route path="/procesos/:procesoId" element={< DetalleProceso />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
