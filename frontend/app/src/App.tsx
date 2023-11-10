// App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import authHeader from "./services/auth-header";
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
import Menu, { NotificationsProvider } from "./Menu"; //falta integrar nuevo menu

import * as AuthService from "./services/auth.service";
import Usuario from "./types/usuario";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BoardAdmin from "./components/BoardAdmin";

import EventBus from "./common/EventBus";
import ExcelTable from "./components/ExcelTable";
import CrearCategoria from "./components/CrearCategoria";
import CategoriasList from "./components/CategoriasList";
import CrearCultivar from "./components/CrearCultivar";
import ListarCultivares from "./components/ListarCultivares";
import CrearProcesoProgramado from "./components/CrearProcesoProgramado";
import AuthVerify from "./common/AuthVerify";
import CambiarDeCategoria from "./components/CambiarDeCategoria";
import { Footer } from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NotificationsProvider>
        <Menu />
        <Routes>
          <Route
            path="/lotes/crear-lote"
            element={
              <RequireAuth>
                <CrearLote />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/cambiar-de-categoria/:id"
            element={
              <RequireAuth>
                <CambiarDeCategoria />
              </RequireAuth>
            }
          />
          <Route
            path="/categorias/:id"
            element={
              <RequireAuth>
                <CrearCategoria />
              </RequireAuth>
            }
          />
          <Route
            path="/categorias"
            element={
              <RequireAuth>
                <CategoriasList />
              </RequireAuth>
            }
          />
          <Route
            path="/cultivares/:id"
            element={
              <RequireAuth>
                <CrearCultivar />
              </RequireAuth>
            }
          />
          <Route
            path="/cultivares"
            element={
              <RequireAuth>
                <ListarCultivares />
              </RequireAuth>
            }
          />
          <Route
            path="/generar/informe"
            element={
              <RequireAuth>
                <ExcelTable />
              </RequireAuth>
            }
          />
          <Route
            path="/agenda/general"
            element={
              <RequireAuth>
                <AgendaGeneralDeProcesos />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes"
            element={
              <RequireAuth>
                <Loteslist />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/edit"
            element={
              <RequireAuth>
                <EditarLote />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/procesos"
            element={
              <RequireAuth>
                <DetalleLote />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/log/:loteId"
            element={
              <RequireAuth>
                <LoteRevisiones />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/historia"
            element={
              <RequireAuth>
                <VerHistoriaLote />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/procesos/:listId"
            element={
              <RequireAuth>
                <CrearProceso />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/agenda"
            element={
              <RequireAuth>
                <AgendaDeProcesos />
              </RequireAuth>
            }
          />
          <Route
            path="/lotes/:loteId/agenda/new"
            element={
              <RequireAuth>
                <CrearProcesoProgramado />
              </RequireAuth>
            }
          />
          <Route
            path="/procesos/:procesoId"
            element={
              <RequireAuth>
                <DetalleProceso />
              </RequireAuth>
            }
          />
          <Route
            path="/agendas/:id"
            element={
              <RequireAuth>
                <CrearAgenda />
              </RequireAuth>
            }
          />
          <Route
            path="/agendas"
            element={
              <RequireAuth>
                <TipoAgendaList />
              </RequireAuth>
            }
          />
          <Route
            path="/atributos/new"
            element={
              <RequireAuth>
                <CrearAtributo />
              </RequireAuth>
            }
          />
          <Route
            path="/atributos"
            element={
              <RequireAuth>
                <ListarAtributos />
              </RequireAuth>
            }
          />
          <Route
            path="/tipo-proceso/new"
            element={
              <RequireAuth>
                <CrearTipoDeProceso />
              </RequireAuth>
            }
          />
          <Route
            path="/tipo-proceso"
            element={
              <RequireAuth>
                <ListarTiposDeProcesos />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              //deberiamos deja un solo home no? o podriamos hacer que uno sea como una pantalla de presentacion y el otro si sea el home del software. xd
              <RequireAuth>
                {" "}
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                {" "}
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <BoardAdmin />
              </RequireAuth>
            }
          />
        </Routes>
        <Footer/>
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

function RequireAuth({ children }: any) {
  const user = AuthService.getCurrentUser();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

export default App;
