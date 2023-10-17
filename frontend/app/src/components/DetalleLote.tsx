import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";

function DetalleLote() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const navigate = useNavigate();

  //const url = `/lotes/id/${loteId}`;
  const url = `/lotes/${loteId}`;
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
        setLote(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!lote) {
    return <div>Cargando...</div>;
  }

  const handleAnular = () => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez anulado, no podrás recuperar este lote.",
      icon: "warning",
      buttons: ["Cancelar", "Anular"],
      dangerMode: true,
    }).then((willAnular) => {
      if (willAnular) {
        fetch(`/lotes/delete/${lote?.id}`, {
          method: "DELETE",
          headers: authHeader(),
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("El lote ha sido anulado.", {
                icon: "success",
              });
              navigate(-1);
            } else {
              // Si la respuesta no es exitosa, maneja el error aquí
              console.error("Error al anular el lote");
            }
          })
          .catch((error) => {
            // Maneja cualquier error que ocurra durante la solicitud HTTP
            console.error("Error al anular el lote", error);
          });
      }
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalle del Lote </h2>
        <button
          className="btn btn-danger d-flex justify-content-end"
          onClick={handleAnular}
        >
          Anular
        </button>
      </div>
      <p>
        <span className="badge bg-secondary text-white me-2 fs-6">Código:</span>{" "}
        {lote.codigo}
      </p>
      <p>
        <span className="badge bg-secondary text-white me-2 fs-6">
          Cantidad:
        </span>{" "}
        {lote.cantidad}
      </p>
      <p>
        <span className="badge bg-secondary text-white me-2 fs-6">
          Categoría:
        </span>{" "}
        {lote.categoria.nombre}
      </p>
      <p>
        <span className="badge bg-secondary text-white me-2 fs-6">
          Cultivar:
        </span>{" "}
        {lote.cultivar.nombre}
      </p>
      <p>
        <span className="badge bg-secondary text-white me-2 fs-6">Estado:</span>{" "}
        {lote.esHoja ? "Activo" : "Inactivo"}
      </p>

      <h3>
        Procesos &nbsp;&nbsp; &nbsp;&nbsp;
        <Link to={`/lotes/${loteId}/procesos/new`} className="btn btn-primary ">
          Agregar
        </Link>
        <Link
          to={`/lotes/${lote.id}/agenda`}
          className="btn btn-info float-end"
        >
          Ver Agenda
        </Link>
      </h3>

      <table className="table">
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
              <td>{proceso.usuario?.nombre} {proceso.usuario?.apellido}</td>
              <td>{proceso.listaDeAtributos?.nombre}</td>
              <td>
                {proceso.fecha
                  ? new Date(proceso.fecha).toLocaleDateString()
                  : ""}
              </td>
              {/*}<td>{proceso.tipoDeProceso.nombre}</td> a hay que hacer coincidir los nombres del backend con los del front / igual los procesos no tienen tipo ahora*/}
              {/* aca lo mismo, iba el nombre del proceso y la descripcion, ahora cambiamos el modelo de datos */}
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
  );
}

export default DetalleLote;
