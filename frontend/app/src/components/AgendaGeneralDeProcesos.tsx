import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProcesoProgramado } from "../types/procesoProgramado";

function AgendaGeneralDeProcesos() {
  const [lotes, setLotes] = useState<ProcesoProgramado[]>([]);

  useEffect(() => {
    fetch(`/lotes/procesosPendientes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLotes(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container">
      <h3>Agenda de Procesos Pendientes :</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha Programada</th>
            <th>Proceso</th>
            <th> lote</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote, index) => (
            <tr key={lote.id}>
              <td>{index + 1}</td>
              <td>
                {new Date(
                  new Date(lote.fechaARealizar).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </td>

              <td>{lote.proceso.nombre}</td>
              <td>{lote.lote}</td>
              <td>
                <Link
                  to={`/lotes/${lote!.lote}/procesos/${lote.proceso.nombre}`}
                  className="btn btn-primary btn-sm ms-2"
                >
                  Completar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgendaGeneralDeProcesos;
