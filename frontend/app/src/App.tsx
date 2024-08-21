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
import About from "./components/About";
import ForgetPassword from "./components/ForgetPassword";
import PasswordReset from "./components/PasswordReset";

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
                <CategoriasList />
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
                <ListarCultivares />
            }
          />
          <Route
            path="/generar/informe"
            element={
                <ExcelTable />
            }
          />
          <Route
            path="/agenda/general"
            element={
                <AgendaGeneralDeProcesos />
            }
          />
          <Route
            path="/lotes"
            element={
                <Loteslist />
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
          <Route path="/lotes/:loteId/procesos" element={<DetalleLote />} />
          <Route
            path="/lotes/log/:loteId"
            element={
                <LoteRevisiones />
            }
          />
          <Route path="/lotes/:loteId/historia" element={<VerHistoriaLote />} />
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
                <AgendaDeProcesos />
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
                <DetalleProceso />
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
                <TipoAgendaList />
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
                <ListarAtributos />
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
                <ListarTiposDeProcesos />
            }
          />
          <Route
            path="/"
            element={
              //deberiamos deja un solo home no? o podriamos hacer que uno sea como una pantalla de presentacion y el otro si sea el home del software. xd
                <Home />
            }
          />
          <Route
            path="/home"
            element={
                <Home />
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
          <Route
            path="/about"
            element={
                <About />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ForgetPassword/>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PasswordReset/>
            }
          />
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

      <div className="mt-4 " >
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
