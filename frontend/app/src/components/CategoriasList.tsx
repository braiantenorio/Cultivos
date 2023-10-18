import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authHeader from "../services/auth-header";
import { Categoria } from "../types/categoria";
import swal from "sweetalert";
function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const url = "/categorias";

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
        setCategorias(responseData.data);
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
        fetch(`/categorias/delete/${tipoAgendaId}`, {
          method: "DELETE",
          headers: authHeader(),
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("La categoria ha sido anulada.", {
                icon: "success",
              }).then(() => {
                // Eliminar el tipoAgenda de la lista
                setCategorias((prevTipoAgendas) =>
                  prevTipoAgendas.filter(
                    (tipoAgenda) => tipoAgenda.id !== tipoAgendaId
                  )
                );
              });
            } else {
              // Si la respuesta no es exitosa, maneja el error aquí
              swal("Hay lotes activos con esa Categoria.", {
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

  return (
    <div className="container">
      <h2>Categorias </h2>

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
          {categorias.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{index + 1}</td>
              <td>{tipoAgenda.nombre}</td>
              <td>{tipoAgenda.codigo}</td>
              <td>
                <Link
                  to={`/categorias/${tipoAgenda.id}`}
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

export default CategoriasList;
