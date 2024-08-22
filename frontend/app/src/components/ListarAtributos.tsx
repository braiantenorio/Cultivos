import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import swal from "sweetalert";
import { Atributo } from "../types/atributo";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";
import * as AuthService from "../services/auth.service";
import Usuario from "../types/usuario";

function ListarAtributos() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [categorias, setCategorias] = useState<Atributo[]>([]);
  const [resultsPage, setResultsPage] = useState<ResultsPage<Atributo>>({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: 7,
    number: 0,
  });
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const user = AuthService.getCurrentUser();
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    fetchAtributos();
  }, [resultsPage.number, resultsPage.size, showDeleted, categorias]);

  const fetchAtributos = () => {
    fetch(
      `/atributos?filtered=${showDeleted}&page=${resultsPage.number}&size=${resultsPage.size}`,
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
      text: "Una vez borrado, no podrás utilizar este atributo.",
      icon: "warning",
      buttons: ["Cancelar", "Anular"],
      dangerMode: true,
    }).then((willAnular) => {
      if (willAnular) {
        fetch(`/atributos/delete/${tipoAgendaId}`, {
          method: "DELETE",
          headers: authHeader(),
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("El atributo ha sido anulado.", {
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
              swal("Hay tipos de procesos activos con ese atributo.", {
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
  const handleShowDeletedChange = () => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
  };
  const handleEliminarTipoAgenda1 = (tipoAgendaId: number) => {
    fetch(`/atributos/${tipoAgendaId}`, {
      method: "PUT",
      headers: authHeader(),
    })
      .then((response) => {
        if (response.ok) {
          setCategorias((prevTipoAgendas) =>
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

  return (
    <div className="container">
      <h2>Atributos </h2>
      <div className="mb-3 form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDeleted}
          onChange={handleShowDeletedChange}
        />
        <label className="form-check-label">Mostrar Eliminados</label>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Tipo</th>
              <th scope="col">Obligatorio</th>
              <th scope="col">Decimales</th>
              <th scope="col">Caracteres</th>
              <th scope="col">Maximo</th>
              <th scope="col">Minimo</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {resultsPage.content.map((atributo, index) => (
              <tr key={atributo.id}>
                <td>{atributo.nombre}</td>
                <td>
                  {typeof atributo.tipo === "string"
                    ? "texto"
                    : typeof atributo.tipo === "number"
                    ? "numero"
                    : atributo.tipo}
                </td>
                <td>{atributo.obligatorio ? "Si" : "No"}</td>
                <td>{atributo.decimales}</td>
                <td>{atributo.caracteres}</td>
                <td>{atributo.maximo}</td>
                <td>{atributo.minimo}</td>

                {(showModeratorBoard || showAdminBoard) && (
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
                        {!atributo.deleted ? (
                          <>
                            <li>
                              <button
                                className="dropdown-item dropdown-item-danger d-flex gap-2 align-items-center"
                                onClick={() =>
                                  handleEliminarTipoAgenda(atributo.id)
                                }
                              >
                                Anular
                              </button>
                            </li>
                          </>
                        ) : (
                          <button
                            className="dropdown-item d-flex gap-2 align-items-center"
                            onClick={() =>
                              handleEliminarTipoAgenda1(atributo.id)
                            }
                          >
                            Restaurar
                          </button>
                        )}
                      </ul>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!resultsPage.content.length && (
        <div className="alert alert-warning">No se encontraron atributos</div>
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

export default ListarAtributos;
