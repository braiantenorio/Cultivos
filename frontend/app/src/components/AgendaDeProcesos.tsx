import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { ProcesoProgramado } from "../types/procesoProgramado";
import authHeader from "../services/auth-header";
import * as AuthService from "../services/auth.service";
import Usuario from "../types/usuario";

function AgendaDeProcesos() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const url1 = `/lotes/id/${loteId}`;
  const [lotes, setProcesoProgramadoA] = useState<ProcesoProgramado[]>([]);
  const [lotes1, setProcesoProgramadoi] = useState<ProcesoProgramado[]>([]);
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    fetch(url1, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLote(responseData.data);
        const procesosProgramadosAgregados: ProcesoProgramado[] = [];
        const procesosProgramadosExcluidos: ProcesoProgramado[] = [];

        // Recorre la lista de procesos que deseas agregar
        //if(responseData.data.a)
        for (const proceso of responseData.data.agenda.procesosProgramado) {
          // Aplica tu condición lógica
          if (proceso.diaInicio === 0) {
            procesosProgramadosAgregados.push(proceso);
          }
          if (proceso.diaInicio === -1) {
            procesosProgramadosExcluidos.push(proceso);
          }
        }
        setProcesoProgramadoA(procesosProgramadosAgregados);
        setProcesoProgramadoi(procesosProgramadosExcluidos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!lote) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h3>
        Lote: &nbsp;
        <span className="badge badge-custom-1 text-white me-6 fs-7">
          {lote.codigo}
        </span>{" "}
      </h3>

      <div className="d-flex flex-wrap">
        {" "}
        {/* Contenedor de flexbox con "flex-wrap" */}
        <div className="table-responsive col-lg-6 col-12 mt-2">
          <h4 className="col-lg-8">
            Procesos Programados de la Agenda version{" "}
            <span className="badge bg-info text-white me-6 fs-8">
              {lote.agenda.tipoAgenda?.version}
            </span>{" "}
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Proceso</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((proceso: ProcesoProgramado, index) => (
                // Verifica si la cantidad es igual a cero
                <tr key={proceso.id}>
                  <td>{index + 1}</td>
                  <td>{proceso.proceso.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-responsive col-lg-6 col-12 mt-2">
          <h4 className="col-lg-8">
            Procesos Programados independientes &nbsp;
            {showModeratorBoard && (
              <Link
                to={`/lotes/${lote.codigo}/agenda/new`}
                className="btn btn-primary"
              >
                Agregar
              </Link>
            )}
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>

                <th>Proceso</th>

                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lotes1.map((proceso: ProcesoProgramado, index) => (
                <tr key={proceso.id}>
                  <td>{index + 1}</td>
                  <td>{proceso.proceso.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Resto de tu contenido */}
    </div>
  );
}

export default AgendaDeProcesos;
