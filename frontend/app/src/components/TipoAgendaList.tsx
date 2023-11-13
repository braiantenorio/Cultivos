import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import swal from "sweetalert";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";
import * as AuthService from "../services/auth.service";
import Usuario from "../types/usuario";

function TipoAgendaList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const longitud = parseInt(queryParams.get("longitud")!, 10);
  const pagina = parseInt(queryParams.get("pagina")!, 10);
  const navigate = useNavigate(); // Obtiene el objeto navigate
  const [tipoAgendas, setTipoAgendas] = useState<TipoAgenda[]>([]);
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const user = AuthService.getCurrentUser();

  const [resultsPage, setResultsPage] = useState<ResultsPage<TipoAgenda>>({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: longitud, // Usamos 0 como valor predeterminado si no se puede convertir a entero
    number: pagina - 1,
  });
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
    if (user.roles.includes("ROLE_ADMIN")) {
      setShowModeratorBoard(true);
    }
    navigate(
      `/agendas?pagina=${resultsPage.number + 1}&longitud=${resultsPage.size}`
    );
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

      <table className="table table-responsive">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Version</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resultsPage.content.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{tipoAgenda.categoria.nombre}</td>
              <td>{tipoAgenda.version}</td>
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
                    <li>
                      <a
                        className="dropdown-item"
                        href={`/agendas/${tipoAgenda.id}`}
                      >
                        Detalle
                      </a>
                    </li>

                    {showModeratorBoard && (
                      <div>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
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
                      </div>
                    )}
                  </ul>
                </div>
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
