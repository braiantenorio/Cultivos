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
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import EventBus from "./common/EventBus";
import ExcelTable from "./components/ExcelTable";

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
            path="/lotes/:loteId"
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
          <Route path="/" element={<Home />} />
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
            path="/user"
            element={
              <RequireAuth>
                <BoardUser />
              </RequireAuth>
            }
          />
          <Route
            path="/mod"
            element={
              <RequireAuth>
                <BoardModerator />
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
/*
function Menu() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(undefined);

  
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


  const navigate = useNavigate();
  const navigateToLink = (link: string) => {
    const llink = "/lotes/" + link;
    navigate(llink);
  };

  if (isLoginPage) {
    return null; // No renderizar la barra de navegación en /login o /register
  }

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

      {showModeratorBoard && (
        <li className="nav-item">
          <Link to={"/mod"} className="nav-link">
            Moderator Board
          </Link>
        </li>
      )}

      {showAdminBoard && (
        <li className="nav-item">
          <Link to={"/admin"} className="nav-link">
            Admin Board
          </Link>
        </li>
      )}

      {currentUser && (
        <li className="nav-item">
          <Link to={"/user"} className="nav-link">
            User
          </Link>
        </li>
      )}

      {currentUser ? (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/profile"} className="nav-link">
              {currentUser.username}
            </Link>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={logOut}>
              Cerrar sesion
            </a>
          </li>
        </div>
      ) : (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/login"} className="nav-link">
              Iniciar sesion
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/register"} className="nav-link">
              Registrarse
            </Link>
          </li>
        </div>
      )}
    </div>
  );
}*/

export default App;
