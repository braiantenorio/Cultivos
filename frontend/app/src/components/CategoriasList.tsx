import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authHeader from "../services/auth-header";
import { Categoria } from "../types/categoria";
import swal from "sweetalert";
import { ResultsPage } from "../types/ResultsPage";
import Usuario from "../types/usuario";
import * as AuthService from "../services/auth.service";
function CategoriasList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const longitud = parseInt(queryParams.get("longitud")!, 10);
  const pagina = parseInt(queryParams.get("pagina")!, 10);
  const navigate = useNavigate(); // Obtiene el objeto navigate
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const user = AuthService.getCurrentUser();
  const [resultsPage, setResultsPage] = useState<ResultsPage<Categoria>>({
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

    navigate(
      `/categorias?pagina=${resultsPage.number + 1}&longitud=${
        resultsPage.size
      }`
    );
    fetchAtributos();
  }, [showDeleted, resultsPage.number, resultsPage.size, categorias]);

  const fetchAtributos = () => {
    fetch(
      `/categorias?filtered=${showDeleted}&page=${resultsPage.number}&size=${resultsPage.size}`,
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
      text: "Una vez borrado, no podrás utilizar esta categoria.",
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
  const handleShowDeletedChange = () => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
  };
  const handleEliminarTipoAgenda1 = (tipoAgendaId: number) => {
    fetch(`/categorias/${tipoAgendaId}`, {
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
      <h2>Categorias</h2>
      <div className="mb-3 form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDeleted}
          onChange={handleShowDeletedChange}
        />
        <label className="form-check-label">Mostrar Eliminados</label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Codigo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resultsPage.content.map((categoria, index) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.codigo}</td>
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
                      {!categoria.deleted ? (
                        <div>
                          <li>
                            <a
                              className="dropdown-item"
                              href={`/categorias/${categoria.id}`}
                            >
                              Editar
                            </a>
                          </li>

                          <div>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            <li>
                              <button
                                className="dropdown-item dropdown-item-danger d-flex gap-2 align-items-center"
                                onClick={() =>
                                  handleEliminarTipoAgenda(categoria.id)
                                }
                              >
                                Anular
                              </button>
                            </li>
                          </div>
                        </div>
                      ) : (
                        <li>
                          <button
                            className="dropdown-item  d-flex gap-2 align-items-center"
                            onClick={() =>
                              handleEliminarTipoAgenda1(categoria.id)
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
        <div className="alert alert-warning">No se encontraron categorias</div>
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

export default CategoriasList;
