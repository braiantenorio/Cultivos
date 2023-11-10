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
        <div>
          <div key={lote.id}>
            <div className="card mt-2 mb-4">
              <div className="card-header">Lote: {lote.codigo}</div>
              <div className="card-body">
                <h5 className="card-title">{lote.categoria.nombre}</h5>
                <p className="card-text">
                  <dl className="row">
                    <dt className="col-sm-3">Cultivar</dt>
                    <dd className="col-sm-9">{lote.cultivar.nombre}</dd>

                    <dt className="col-sm-3">Cantidad</dt>
                    <dd className="col-sm-9">{lote.cantidad}</dd>

                    <dt className="col-sm-3">Fecha de alta</dt>
                    <dd className="col-sm-9">{lote.fecha.toString()}</dd>

                    <dt className="col-sm-3">Estado</dt>
                    <dd className="col-sm-9">
                      {lote.fechaDeBaja ? "Inactivo" : "Activo"}
                    </dd>

                    {lote.fechaDeBaja ? (
                      <>
                        <dt className="col-sm-3">Fecha de baja</dt>
                        <dd className="col-sm-9">
                          {lote.fechaDeBaja.toString()}
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </p>
                <a
                  href={`/lotes/${lote.codigo}/procesos?pagina=1&longitud=5`}
                  className="btn btn-primary"
                >
                  Ver detalle
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VerHistoriaLote;
