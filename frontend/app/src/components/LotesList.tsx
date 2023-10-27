import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lote } from "../types/lote";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";

function Loteslist() {
  const [resultsPage, setResultsPage] = useState<ResultsPage<Lote>>({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: 7,
    number: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchLotes();
  }, [showDeleted, resultsPage.number, resultsPage.size]);

  const fetchLotes = () => {
    fetch(
      `/lotes?filtered=${showDeleted}&term=${searchTerm}&page=${resultsPage.number}&size=${resultsPage.size}`,
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
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleShowDeletedChange = () => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
  };
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    //   const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue);

    // if (isValidInput) {
    setSearchTerm(inputValue);
    //  setRegla(false);
    //} else {
    //   setRegla(true);
    // }
  };
  const handleBuscarLote = () => {
    fetchLotes();
  };

  // Resto del código del componente

  const handlePageChange = (newPage: number) => {
    setResultsPage({
      ...resultsPage,
      number: newPage,
    });
  };
  const pageNumbers = Array.from(Array(resultsPage.totalPages).keys()).map(
    (n) => n + 1
  );

  return (
    <div className="container">
      <h2>Lotes</h2>
      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-6 col-lg-3  mb-sm-1">
          <div className="d-flex align-items-center">
            <input
              type="search"
              placeholder="Buscar Lote por código"
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="form-control"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBuscarLote}
            >
              <i
                className="bi bi-search bi-lg"
                style={{ fontSize: "1rem", cursor: "pointer" }}
              ></i>
            </button>
          </div>
        </div>
        <div className=" col-md-6 mb-3 form-check form-switch">
          <input
            className="form-check-input ms-3 mt-2 "
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeletedChange}
          />
          <label className="form-check-label mt-1">Mostrar Eliminados</label>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          {" "}
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Cultivar</th>
              <th>{showDeleted ? "Fecha de baja" : ""} </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultsPage.content.map((lote, index) => (
              <tr key={lote.id}>
                <td>{index + 1}</td>
                <td>
                  {" "}
                  <span className="badge badge-custom-1 text-white me-2 fs-6">
                    {lote.codigo}
                  </span>
                </td>
                <td>{lote.cantidad}</td>
                <td>{lote.categoria.nombre}</td>
                <td>{lote.cultivar.nombre}</td>
                <td>
                  {showDeleted
                    ? new Date(lote.fechaDeBaja).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  <Link
                    to={`/lotes/${lote.codigo}`}
                    className="text-info me-2"
                    title="Detalle"
                  >
                    <i
                      className="bi bi-eye"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    ></i>
                  </Link>
                  &nbsp;&nbsp;
                  {lote.deleted ? (
                    <i
                      className="bi bi-pencil-slash text-warning me-2"
                      style={{ fontSize: "1.5rem", cursor: "not-allowed" }}
                      title="Editar"
                    ></i>
                  ) : (
                    <Link
                      to={`/lotes/${lote.id}/edit`}
                      className="text-warning me-2"
                      title="Editar"
                    >
                      <i
                        className="bi bi-pencil"
                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      ></i>
                    </Link>
                  )}
                  &nbsp;&nbsp;
                  <Link
                    to={`/lotes/log/${lote.id}`}
                    className="text-secondary me-2"
                    title="Logs"
                  >
                    <i
                      className="bi bi-journal"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    ></i>
                  </Link>
                  <Link
                    to={`/lotes/${lote.id}/historia`}
                    className="btn btn-sm btn-success me-2"
                  >
                    Historia
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default Loteslist;
