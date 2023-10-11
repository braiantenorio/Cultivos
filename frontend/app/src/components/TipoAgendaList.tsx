import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import swal from "sweetalert";

function TipoAgendaList() {
  const [tipoAgendas, setTipoAgendas] = useState<TipoAgenda[]>([]);

  useEffect(() => {
    const url = "/tipoagendas";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setTipoAgendas(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleEliminarTipoAgenda = (tipoAgendaId: number) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez borrado, no podrás recuperar esta agenda.",
      icon: "warning",
      buttons: ["Cancelar", "Anular"],
      dangerMode: true,
    }).then((willAnular) => {
      if (willAnular) {
        fetch(`/tipoagendas/delete/${tipoAgendaId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("El lote ha sido anulado.", {
                icon: "success",
              }).then(() => {
                // Eliminar el tipoAgenda de la lista
                setTipoAgendas((prevTipoAgendas) =>
                  prevTipoAgendas.filter(
                    (tipoAgenda) => tipoAgenda.id !== tipoAgendaId
                  )
                );
              });
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
      <h2>Agendas </h2>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Categoria</th>
            <th>Version</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tipoAgendas.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{index + 1}</td>
              <td>{tipoAgenda.categoria.nombre}</td>
              <td>{tipoAgenda.version}</td>
              <td>
                <Link
                  to={`/agendas/${tipoAgenda.id}`}
                  className="text-warning me-2"
                  title="Editar"
                >
                  <i
                    className="bi bi-pencil"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  ></i>
                </Link>
                &nbsp;&nbsp;
                <button
                  className="text-danger border-0 bg-transparent me-2"
                  onClick={() => handleEliminarTipoAgenda(tipoAgenda.id)}
                  title="Eliminar"
                >
                  <i
                    className="bi bi-trash"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  ></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TipoAgendaList;
