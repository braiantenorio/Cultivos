import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";

function VerHistoriaLote() {
  const { loteId } = useParams();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const navigate = useNavigate();

  const url = `/lotes/historia/${loteId}`;
  useEffect(() => {
    fetch(url, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLotes(responseData.data);
        console.log(lotes);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!lotes) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Historia de lote</h2>
      </div>
      {lotes.map((lote) => (
        <div key={lote.id}>
          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button btn-sm"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${lote.id}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${lote.id}`}
                >
                  Codigo: {lote.codigo}
                </button>
              </h2>
              <div
                id={`collapse-${lote.id}`}
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <table className="table caption-top">
                    <caption>Procesos</caption>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lote.procesos.map((proceso) => (
                        <tr key={proceso.id}>
                          <td>{proceso.id}</td>
                          <td>
                            {proceso.usuario?.nombre}{" "}
                            {proceso.usuario?.apellido}
                          </td>
                          <td>{proceso.listaDeAtributos.nombre}</td>
                          <td>
                            {proceso.fecha
                              ? new Date(proceso.fecha).toLocaleDateString()
                              : ""}
                          </td>
                          <td>
                            <Link
                              to={`/procesos/${proceso.id}`}
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VerHistoriaLote;
