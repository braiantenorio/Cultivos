import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { ProcesoProgramado } from "../types/procesoProgramado";
import authHeader from "../services/auth-header";

function AgendaDeProcesos() {
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const url1 = `/lotes/id/${loteId}`;
  const [allProcesos, setAllProcesos] = useState<ProcesoProgramado[]>([]);
  const [currentProcesos, setCurrentProcesos] = useState<ProcesoProgramado[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const totalProcesos = allProcesos.length;
  const totalPages = Math.ceil(totalProcesos / pageSize);
  const pageNumbers = [];

  useEffect(() => {
    fetch(url1, {
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
        setAllProcesos(
          responseData.data.agenda.procesosProgramado
            .slice()
            .sort(
              (
                a: { fechaARealizar: string | number | Date; completado: any },
                b: { fechaARealizar: string | number | Date; completado: any }
              ) => {
                const fechaA = new Date(a.fechaARealizar);
                const fechaB = new Date(b.fechaARealizar);

                // Compara las fechas para ordenar en función de la prioridad
                if (a.completado && !b.completado) {
                  return 1; // Proceso no realizado primero
                } else if (!a.completado && b.completado) {
                  return -1; // Proceso no realizado primero
                } else if (a.completado && b.completado) {
                  // Si ambos son procesos completados, ordena por fecha en orden descendente
                  return fechaB.getTime() - fechaA.getTime();
                } else {
                  // Si ambos son procesos no completados, ordena por fecha en orden ascendente
                  return fechaA.getTime() - fechaB.getTime();
                }
              }
            )
        );
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

  return (
    <div className="container">
      <h3>
        Agenda de Procesos &nbsp;&nbsp; &nbsp;&nbsp;
        <Link to={`/lotes/${loteId}/agenda/new`} className="btn btn-primary ">
          Agregar
        </Link>
      </h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha a Realizar</th>
              <th>Proceso</th>
              <th>&nbsp; Estado</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentProcesos?.map((proceso: ProcesoProgramado) => {
              const fechaARealizar = new Date(proceso.fechaARealizar);
              fechaARealizar.setDate(fechaARealizar.getDate() + 1); // Agrega un día a la fecha
              const fechaARealizar1 = new Date();
              fechaARealizar1.setDate(fechaARealizar1.getDate() + 1); // Agrega un día a la fecha

              return (
                <tr key={proceso.id}>
                  <td>{proceso.id}</td>
                  <td>{fechaARealizar.toLocaleDateString()}</td>
                  <td>{proceso.proceso.nombre}</td>
                  <td>
                    {proceso.completado ? (
                      <span className="badge bg-success ms-2">Realizado</span>
                    ) : fechaARealizar1 >= fechaARealizar ||
                      lote?.fechaDeBaja ? (
                      <>
                        <span className="badge bg-danger ms-2">
                          No Realizado
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="badge bg-warning ms-2">
                          A Realizar
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
                  className={`page-item ${pageNumber === page ? "active" : ""}`}
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
  );
}

export default AgendaDeProcesos;
