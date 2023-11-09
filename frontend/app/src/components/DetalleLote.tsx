import React, { useEffect, useState, Children } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";
import Usuario from "../types/usuario";
import * as AuthService from "../services/auth.service";

function DetalleLote() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [allProcesos, setAllProcesos] = useState<Proceso[]>([]);
  const [currentProcesos, setCurrentProcesos] = useState<Proceso[]>([]);
  const [page, setPage] = useState(parseInt(queryParams.get("pagina")!, 10));
  const [pageSize, setPageSize] = useState(
    parseInt(queryParams.get("longitud")!, 10)
  );
  const navigate = useNavigate();
  const totalProcesos = allProcesos.length;
  const totalPages = Math.ceil(totalProcesos / pageSize);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
  const [showDeleted, setShowDeleted] = useState(false);

  const url = `/lotes/${loteId}`;
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
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
        setAllProcesos(responseData.data.procesos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateCurrentProcesos = (
    page: number,
    pageSize: number,
    showDeleted1: boolean
  ) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Filtra los procesos en función del estado de showDeleted
    const filteredProcesos = showDeleted1
      ? allProcesos.filter((proceso) => proceso.deleted)
      : allProcesos.filter((proceso) => !proceso.deleted); // Asumiendo que hay una propiedad llamada "anulado"
    const currentProcesos = filteredProcesos.slice(startIndex, endIndex);
    setCurrentProcesos(currentProcesos);
    setPageNumbers([]);
    const pagesn = [];
    for (let i = 1; i <= Math.ceil(filteredProcesos.length / pageSize); i++) {
      pagesn.push(i);
    }
    setPageNumbers(pagesn);
  };

  useEffect(() => {
    navigate(`/lotes/${loteId}/procesos?pagina=${page}&longitud=${pageSize}`);
    updateCurrentProcesos(page, pageSize, showDeleted);
  }, [page, pageSize, lote]);

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

  const handleSort = (field: string) => {
    // Alternar la dirección de ordenamiento si ya se ordena por el mismo campo
    if (field === sortField && sortDirection === "asc") {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else if (field === sortField && sortDirection === "desc") {
      reserSort();
      console.log("reset");
      return;
    } else {
      // Establecer el nuevo campo de ordenamiento y la dirección predeterminada
      setSortField(field);
      setSortDirection("asc");
    }
    console.log("no reset");

    const sortedData = [...currentProcesos].sort((a, b) => {
      // Accede a los campos dinámicamente usando el nombre del campo (field)
      const aValue = a[field as keyof Proceso];
      const bValue = b[field as keyof Proceso];

      // Realiza la comparación según el campo especificado
      if (sortDirection === "asc") {
        return aValue! < bValue! ? 1 : -1;
      } else {
        return bValue! < aValue! ? 1 : -1;
      }
    });
    setCurrentProcesos(sortedData);
  };

  const reserSort = () => {
    setSortField("id");
    setSortDirection("asc");

    const sortedData = [...currentProcesos].sort((a, b) =>
      a.id! > b.id! ? 1 : -1
    );
    setCurrentProcesos(sortedData);
  };
  const handleShowDeletedChange = (showDeleted1: boolean) => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
    // Llama a la función para actualizar la lista de procesos
    updateCurrentProcesos(page, pageSize, showDeleted1);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalle del Lote</h2>
        {showModeratorBoard && (
          <button className="btn btn-danger" onClick={handleAnular}>
            Anular
          </button>
        )}
      </div>

      <div className="detail-info row">
        <div className="col-12 col-md-6 col-lg-4">
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Código:
            </span>{" "}
            {lote.codigo}
          </p>
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Cantidad:
            </span>{" "}
            {lote.cantidad}
          </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Categoría:
            </span>{" "}
            {lote.categoria.nombre}
          </p>

          <p className="align-self-start">
            <span className="badge bg-secondary text-white me-2 fs-6">
              Cultivar:
            </span>{" "}
            {lote.cultivar.nombre}
          </p>
          {lote.fechaDeBaja && (
            <p>
              <span className="badge bg-secondary text-white me-2 fs-6">
                Fecha de Baja:
              </span>{" "}
              {new Date(
                new Date(lote.fechaDeBaja).getTime() + 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="qr-code">
        <p>
          <a
            href={"http://localhost:8080/qrcodes/" + lote.codigo}
            target="_blank"
            rel="noreferrer"
          >
            Ver código QR
          </a>
        </p>
      </div>

      <div className="processes">
        <div className="row">
          <div className="col-8 col-md-6 col-lg-10 row">
            <div className="col-md-3 ">
              <h3>
                <span>Procesos&nbsp;&nbsp;</span>
                {showModeratorBoard && (
                  <Link
                    to={`/lotes/${loteId}/procesos/new`}
                    className="btn btn-primary "
                  >
                    Cargar
                  </Link>
                )}
              </h3>
            </div>

            <div className="col-md-3 mb-3 form-check form-switch">
              <label className="form-check-label mt-1">Anulados</label>
              <input
                className="form-check-input ms-3 mt-2"
                type="checkbox"
                checked={showDeleted}
                onChange={() => handleShowDeletedChange(!showDeleted)}
              />
            </div>
          </div>

          <div className="col-4 col-md-3 col-lg-2">
            <Link
              to={`/lotes/${lote.id}/agenda`}
              className="btn btn-info float-end"
            >
              Agenda
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {/*<th>ID</th>*/}
                <th onClick={() => handleSort("usuario")}>
                  Usuario{" "}
                  {sortField === "usuario" && (
                    <i
                      className={`bi bi-arrow-${
                        sortDirection === "asc" ? "up" : "down"
                      }`}
                    ></i>
                  )}
                </th>
                <th onClick={() => handleSort("listaDeAtributos")}>
                  Tipo{" "}
                  {sortField === "listaDeAtributos" && (
                    <i
                      className={`bi bi-arrow-${
                        sortDirection === "asc" ? "up" : "down"
                      }`}
                    ></i>
                  )}
                </th>
                <th onClick={() => handleSort("fecha")}>
                  Fecha{" "}
                  {sortField === "fecha" && (
                    <i
                      className={`bi bi-arrow-${
                        sortDirection === "asc" ? "up" : "down"
                      }`}
                    ></i>
                  )}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentProcesos.map((proceso) => (
                <Link
                  to={`/procesos/${proceso.id}`}
                  key={proceso.id}
                  className="table-row"
                >
                  {/*<td>{proceso.id}</td>*/}
                  <td>
                    {proceso.usuario?.nombre} {proceso.usuario?.apellido}
                  </td>
                  <td>{proceso.listaDeAtributos?.nombre}</td>
                  <td>
                    {proceso.fecha
                      ? new Date(proceso.fecha).toLocaleDateString()
                      : ""}
                  </td>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
        {!currentProcesos.length && (
          <div className="alert alert-warning">No se encontraron procesos</div>
        )}
        <nav aria-label="Page navigation example">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => {
                      if (page > 1) {
                        setPage(page - 1);
                        updateCurrentProcesos(page - 1, pageSize, showDeleted);
                      }
                    }}
                  >
                    &lsaquo;
                  </button>
                </li>
                {pageNumbers.map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      pageNumber === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        if (pageNumber !== page) {
                          setPage(pageNumber);
                          updateCurrentProcesos(
                            pageNumber,
                            pageSize,
                            showDeleted
                          );
                        }
                      }}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    page * pageSize >= allProcesos.length ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      if (page * pageSize < allProcesos.length) {
                        setPage(page + 1);
                        updateCurrentProcesos(page + 1, pageSize, showDeleted);
                      }
                    }}
                  >
                    &rsaquo;
                  </button>
                </li>
              </ul>
            </div>
            <div className="input-group col-auto d-none d-md-flex align-items-center">
              <div className="input-group-text mb-3">Elementos por página</div>
              <div className="col-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = parseInt(e.target.value);
                    setPageSize(newPageSize);
                    updateCurrentProcesos(page, newPageSize, showDeleted);
                  }}
                  className="form-control mb-3"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default DetalleLote;
