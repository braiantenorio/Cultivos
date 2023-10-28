import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import { TipoDeProceso } from "../types/tipoDeProceso";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";

function ListarTiposDeProcesos() {
  const [resultsPage, setResultsPage] = useState<ResultsPage<TipoDeProceso>>({
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
    fetch(
      `/listaDeAtributos?page=${resultsPage.number}&size=${resultsPage.size}`,
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

  return (
    <div className="container">
      <h2>Tipos de Procesos </h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Atributos</th>
            </tr>
          </thead>
          <tbody>
            {resultsPage.content.map((tipoAgenda, index) => (
              <tr key={tipoAgenda.id}>
                <td>{index + 1}</td>
                <td>{tipoAgenda.nombre}</td>
                <td colSpan={4}>
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Obligatorio</th>
                        <th>Decimales</th>
                        <th>Caracteres</th>
                        <th>Maximo</th>
                        <th>Minimo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tipoAgenda.atributos.map((tipoAgenda, index) => (
                        <tr key={tipoAgenda.id}>
                          <td>{tipoAgenda.nombre}</td>
                          <td>{tipoAgenda.tipo}</td>
                          <td>{tipoAgenda.obligatorio ? "Si" : "No"}</td>
                          <td>{tipoAgenda.decimales}</td>
                          <td>{tipoAgenda.caracteres}</td>
                          <td>{tipoAgenda.maximo}</td>
                          <td>{tipoAgenda.minimo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default ListarTiposDeProcesos;
