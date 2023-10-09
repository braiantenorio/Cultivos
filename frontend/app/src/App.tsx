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
import Menu, { NotificationsProvider } from "./Menu";

function App() {
  return (
    <BrowserRouter>
      <NotificationsProvider>
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
      </NotificationsProvider>
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

export default App;
