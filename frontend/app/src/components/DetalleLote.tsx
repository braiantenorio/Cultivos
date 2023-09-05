import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";

function DetalleLote() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const [procesos, setProcesos] = useState<Proceso[]>([]);
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

    const registrosDeProcesosUrl = `/registros-de-procesos/lotes/${loteId}`;
    fetch(registrosDeProcesosUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setProcesos(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!lote) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Detalle del Lote</h2>
      <p>
        <strong>ID del Lote:</strong> {lote.id}
      </p>
      <p>
        <strong>Código:</strong> {lote.codigo}
      </p>
      <p>
        <strong>Cantidad:</strong> {lote.cantidad}
      </p>
      <p>
        <strong>Categoría:</strong> {lote.categoria.nombre}
      </p>

      <h3>Procesos :</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {procesos.map((proceso) => (
            <tr key={proceso.id}>
              <td>{proceso.id}</td>
              <td>{proceso.nombre}</td>
              <td>{proceso.descripcion}</td>
              <td>
                <Link
                  to={`/lotes/${lote.id}`}
                  className="btn btn-sm btn-info me-2"
                >
                  Ver Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleLote;
