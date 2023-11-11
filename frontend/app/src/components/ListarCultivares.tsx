import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authHeader from "../services/auth-header";
import swal from "sweetalert";
import { Cultivar } from "../types/cultivar";
import { ResultsPage } from "../types/ResultsPage";
import * as AuthService from "../services/auth.service";
import Usuario from "../types/usuario";
function ListarCultivares() {
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const user = AuthService.getCurrentUser();
  const [resultsPage, setResultsPage] = useState<ResultsPage<Cultivar>>({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: 7,
    number: 0,
  });
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
    fetchAtributos();
  }, [showDeleted, resultsPage.number, resultsPage.size, cultivares]);

  const fetchAtributos = () => {
    fetch(
      `/cultivares?filtered=${showDeleted}&page=${resultsPage.number}&size=${resultsPage.size}`,
      {
        headers: authHeader(),
      }
    )
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
        <label className="form-check-label form-switch">
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
            <th>Nombre</th>
            <th>Codigo</th>
          </tr>
        </thead>
        <tbody>
          {resultsPage.content.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{tipoAgenda.nombre}</td>
              <td>{tipoAgenda.codigo}</td>
              {showModeratorBoard && (
                <td>
                  <div className="dropdown" style={{ position: "static" }}>
                    <button
                      className="d-flex align-items-center link-body-emphasis text-decoration-none"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        position: "static",
                        padding: 0,
                        border: "none",
                        background: "none",
                      }}
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul
                      className="dropdown-menu text-small shadow "
                      data-boundary="viewport"
                    >
                      {!tipoAgenda.deleted ? (
                        <li>
                          <button
                            className="dropdown-item dropdown-item-danger d-flex gap-2 align-items-center"
                            onClick={() =>
                              handleEliminarTipoAgenda(tipoAgenda.id)
                            }
                          >
                            Anular
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button
                            className="dropdown-item d-flex gap-2 align-items-center"
                            onClick={() =>
                              handleEliminarTipoAgenda1(tipoAgenda.id)
                            }
                          >
                            Restaurar
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              )}
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

export default ListarCultivares;
