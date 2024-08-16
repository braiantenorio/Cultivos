import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoteRevision } from "../types/LoteRevision";
import authHeader from "../services/auth-header";

function LoteRevisiones() {
  const [lotesRevision, setLotesRevision] = useState<LoteRevision[]>([]);

  const { loteId } = useParams();
  const navigate = useNavigate();

  const url = `/lotes/log/${loteId}`;

  useEffect(() => {
    fetch(url, {
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setLotesRevision(responseData.data);
        console.log(responseData.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos ", error);
      });
  }, []);

  return (
    <div>
      <div className="container">
        <h2>
          <div className="mb-3 row align-items-center">
            <div className="col-6 col-md-6 col-lg-3"> Logs de Lote</div>
            <div className="col-4 col-md-6 col-lg-4  ms-5">
              <button className="btn btn-danger" onClick={() => navigate(-1)}>
                Atras <i className="bi bi-arrow-left"></i>{" "}
              </button>
            </div>
          </div>
        </h2>
        <div className="table-responsive ">
          <table className="table">
            <thead>
              <tr>
                <th>Lote</th>
                <th>Cantidad</th>
                <th>Activo</th>
                <th>Eliminado</th>
                <th>Fecha </th>
                <th>hora </th>
                <th>Usuario </th>
              </tr>
            </thead>
            <tbody>
              {lotesRevision.map((revision, index) => (
                <tr key={index}>
                  <td>{revision.entidad.codigo}</td>
                  <td>{revision.entidad.cantidad}</td>
                  <td>{revision.entidad.fechaDeBaja ? "No" : "Si"}</td>
                  <td>{revision.entidad.deleted ? "Sí" : "No"}</td>
                  <td>
                    {new Date(revision?.revisionDate).toLocaleDateString()}{" "}
                  </td>
                  <td>
                    {new Date(revision?.revisionDate).toLocaleTimeString()}
                  </td>
                  <td>{revision.usuario?.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LoteRevisiones;
