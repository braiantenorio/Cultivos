import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";

function DetalleLote() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const [allProcesos, setAllProcesos] = useState<Proceso[]>([]);
  const [currentProcesos, setCurrentProcesos] = useState<Proceso[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const totalProcesos = allProcesos.length;
  const totalPages = Math.ceil(totalProcesos / pageSize);
  const pageNumbers = [];

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
        setAllProcesos(responseData.data.procesos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateCurrentProcesos = (page: number, pageSize: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProcesos = allProcesos.slice(startIndex, endIndex);
    setCurrentProcesos(currentProcesos);
  };
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  useEffect(() => {
    updateCurrentProcesos(page, pageSize);
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalle del Lote</h2>
        <button className="btn btn-danger" onClick={handleAnular}>
          Anular
        </button>
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
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Categoría:
            </span>{" "}
            {lote.categoria.nombre}
          </p>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
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
              {new Date(lote.fechaDeBaja).toLocaleDateString()}
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
        <h3>
          Procesos &nbsp;&nbsp;
          <Link
            to={`/lotes/${loteId}/procesos/new`}
            className="btn btn-primary"
          >
            Cargar
          </Link>
          <Link
            to={`/lotes/${lote.id}/agenda`}
            className="btn btn-info float-end"
          >
            Ver Agenda
          </Link>
        </h3>
        <div className="table-responsive">
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
              {currentProcesos.map((proceso) => (
                <Link
                  to={`/procesos/${proceso.id}`}
                  key={proceso.id}
                  className="table-row"
                >
                  <td>{proceso.id}</td>
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
                        updateCurrentProcesos(page - 1, pageSize);
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
                          updateCurrentProcesos(pageNumber, pageSize);
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
                        updateCurrentProcesos(page + 1, pageSize);
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
                    updateCurrentProcesos(page, newPageSize);
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
