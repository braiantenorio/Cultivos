import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authHeader from "../services/auth-header";
import swal from "sweetalert";
import { Cultivar } from "../types/cultivar";
function ListarCultivares() {
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetch(`/cultivares?filtered=${showDeleted}`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setCultivares(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [showDeleted]);
  const handleEliminarTipoAgenda = (tipoAgendaId: number) => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez borrado, no podrás utilizar este cultivar.",
      icon: "warning",
      buttons: ["Cancelar", "Anular"],
      dangerMode: true,
    }).then((willAnular) => {
      if (willAnular) {
        fetch(`/cultivares/delete/${tipoAgendaId}`, {
          method: "DELETE",
          headers: authHeader(),
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("El cultivar ha sido anulado.", {
                icon: "success",
              }).then(() => {
                // Eliminar el tipoAgenda de la lista
                setCultivares((prevTipoAgendas) =>
                  prevTipoAgendas.filter(
                    (tipoAgenda) => tipoAgenda.id !== tipoAgendaId
                  )
                );
              });
            } else {
              // Si la respuesta no es exitosa, maneja el error aquí
              swal("Hay Lotes activos con ese Cultivar.", {
                icon: "error",
              }).then(() => {
                // Eliminar el tipoAgenda de la lista
              });
              console.error("Error al anular el lote");
            }
          })
          .catch((error) => {
            console.error("Error al anular el lote", error);
          });
      }
    });
  };
  const handleEliminarTipoAgenda1 = (tipoAgendaId: number) => {
    fetch(`/cultivares/${tipoAgendaId}`, {
      method: "PUT",
      headers: authHeader(),
    })
      .then((response) => {
        if (response.ok) {
          setCultivares((prevTipoAgendas) =>
            prevTipoAgendas.filter(
              (tipoAgenda) => tipoAgenda.id !== tipoAgendaId
            )
          );
        } else {
          console.error("Error al anular el lote");
        }
      })
      .catch((error) => {
        console.error("Error al anular el lote", error);
      });
  };

  const handleShowDeletedChange = () => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
  };

  return (
    <div className="container">
      <h2>Cultivares </h2>

      <div className="col-auto">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeletedChange}
          />
          Mostrar Eliminados
        </label>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Codigo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cultivares.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{index + 1}</td>
              <td>{tipoAgenda.nombre}</td>
              <td>{tipoAgenda.codigo}</td>
              <td>
                {!tipoAgenda.deleted ? (
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
                ) : (
                  <button
                    className="text-info border-0 bg-transparent me-2"
                    onClick={() => handleEliminarTipoAgenda1(tipoAgenda.id)}
                    title="Eliminar"
                  >
                    <i
                      className="bi bi-arrow-clockwise"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    ></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarCultivares;
