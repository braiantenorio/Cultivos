import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import swal from "sweetalert";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";

function TipoAgendaList() {
  const [tipoAgendas, setTipoAgendas] = useState<TipoAgenda[]>([]);

  const [resultsPage, setResultsPage] = useState<ResultsPage<TipoAgenda>>({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: 7,
    number: 0,
  });
  useEffect(() => {
    fetchAtributos();
  }, [resultsPage.number, resultsPage.size]);

  const fetchAtributos = () => {
    fetch(`/tipoagendas?page=${resultsPage.number}&size=${resultsPage.size}`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setResultsPage(responseData.data);
        console.log(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlePageChange = (newPage: number) => {
    setResultsPage({
      ...resultsPage,
      number: newPage,
    });
  };
  const pageNumbers = Array.from(Array(resultsPage.totalPages).keys()).map(
    (n) => n + 1
  );
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
          headers: authHeader(),
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
          {resultsPage.content.map((tipoAgenda, index) => (
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
      {!resultsPage.content.length && (
        <div className="alert alert-warning">No se encontraron lotes</div>
      )}
      <nav aria-label="Page navigation example">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <ul className="pagination">
              <li
                className={`page-item ${resultsPage.first ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(resultsPage.number - 1)}
                  disabled={resultsPage.first}
                >
                  &lsaquo;
                </button>
              </li>
              {pageNumbers.map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pageNumber === resultsPage.number + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber - 1)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
              <li className={`page-item ${resultsPage.last ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(resultsPage.number + 1)}
                  disabled={resultsPage.last}
                >
                  &rsaquo;
                </button>
              </li>
            </ul>
          </div>
          <div className="input-group col-auto d-none d-md-flex align-items-center">
            <div className="input-group-text mb-3">Elementos por página</div>
            &nbsp;&nbsp;
            <div className="col-1">
              <input
                type="number"
                id="pageSizeInput"
                value={resultsPage.size}
                onChange={(e) =>
                  setResultsPage({ ...resultsPage, size: +e.target.value })
                }
                className="form-control mb-3"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TipoAgendaList;
