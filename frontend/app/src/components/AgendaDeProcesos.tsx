import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { ProcesoProgramado } from "../types/procesoProgramado";

function AgendaDeProcesos() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const url1 = `/lotes/id/${loteId}`;

  useEffect(() => {
    fetch(url1)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLote(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const procesosOrdenados = lote?.agenda?.procesosProgramado
    .slice()
    .sort((a, b) => {
      const fechaA = new Date(a.fechaARealizar);
      const fechaB = new Date(b.fechaARealizar);

      // Compara las fechas para ordenar en función de la prioridad
      if (a.completado && !b.completado) {
        return 1; // Proceso no realizado primero
      } else if (!a.completado && b.completado) {
        return -1; // Proceso no realizado primero
      } else if (a.completado && b.completado) {
        // Si ambos son procesos completados, ordena por fecha en orden descendente
        return fechaB.getTime() - fechaA.getTime();
      } else {
        // Si ambos son procesos no completados, ordena por fecha en orden ascendente
        return fechaA.getTime() - fechaB.getTime();
      }
    });
  const completarProceso = (procesoId: string) => {
    const url = `/procesos/completar/${loteId}/${procesoId}`;
    fetch(url, {
      method: "PUT", // O el método HTTP adecuado
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        fetch(url1)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al realizar la solicitud: ${response.status}`
              );
            }
            return response.json();
          })
          .then((responseData) => {
            setLote(responseData.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h3>Agenda de Procesos :</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha a Realizar</th>
            <th>Proceso</th>
            <th>&nbsp; Estado</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {procesosOrdenados?.map((proceso: ProcesoProgramado) => {
            const fechaARealizar = new Date(proceso.fechaARealizar);
            fechaARealizar.setDate(fechaARealizar.getDate() + 1); // Agrega un día a la fecha
            const fechaARealizar1 = new Date();
            fechaARealizar1.setDate(fechaARealizar1.getDate() + 1); // Agrega un día a la fecha

            return (
              <tr key={proceso.id}>
                <td>{proceso.id}</td>
                <td>{fechaARealizar.toLocaleDateString()}</td>
                <td>{proceso.proceso}</td>
                <td>
                  {proceso.completado ? (
                    <span className="badge bg-success ms-2">Realizado</span>
                  ) : fechaARealizar1 >= fechaARealizar ? (
                    <>
                      <span className="badge bg-danger ms-2">No Realizado</span>
                      <button
                        onClick={() => completarProceso(proceso.proceso)}
                        className="btn btn-primary btn-sm ms-2"
                      >
                        Completado
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="badge bg-warning ms-2">A Realizar</span>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AgendaDeProcesos;
