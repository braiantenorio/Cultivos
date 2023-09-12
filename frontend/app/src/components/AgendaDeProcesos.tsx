import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { ProcesoProgramado } from "../types/procesoProgramado";

function AgendaDeProcesos() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const url = `/lotes/id/${loteId}`;

  useEffect(() => {
    fetch(url)
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
          </tr>
        </thead>
        <tbody>
          {procesosOrdenados?.map((proceso: ProcesoProgramado) => (
            <tr key={proceso.id}>
              <td>{proceso.id}</td>
              <td>{new Date(proceso.fechaARealizar).toLocaleDateString()}</td>
              <td>{proceso.proceso.nombre}</td>
              <td>
                <span
                  className={
                    proceso.completado
                      ? "badge bg-success ms-2"
                      : new Date() >= new Date(proceso.fechaARealizar)
                      ? "badge bg-danger ms-2"
                      : "badge bg-warning ms-2"
                  }
                >
                  {proceso.completado
                    ? "Realizado"
                    : new Date() >= new Date(proceso.fechaARealizar)
                    ? "No Realizado"
                    : "A Realizar"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgendaDeProcesos;
