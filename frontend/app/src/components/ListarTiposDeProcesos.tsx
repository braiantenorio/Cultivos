import React, { useEffect, useState } from "react";
import { TipoDeProceso } from "../types/tipoDeProceso";
import authHeader from "../services/auth-header";
import AutoComplete from "./AutoComplete"; // Importa el componente AutoComplete
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAtributos();
  }, [resultsPage.number, resultsPage.size]);

  const fetchAtributos = () => {
    fetch(
      `/listaDeAtributos?page=${resultsPage.number}&size=${resultsPage.size}&term=${searchTerm}`,
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
  const handleBuscarLote = () => {
    fetchAtributos();
  };

  const handleSearchInputChange = (term: string) => {
    setSearchTerm(term);
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
      <h2>Tipos de Procesos</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <AutoComplete
            onOptionSelect={handleSearchInputChange}
            descripcion="Buscar tipo de proceso por nombre"
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
            {resultsPage.content.map((tipoProceso, index) => (
              <tr key={tipoProceso.id}>
                <td>{index + 1}</td>
                <td>{tipoProceso.nombre}</td>
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
                      </tr>
                    </thead>
                    <tbody>
                      {tipoProceso.atributos.map((atributo) => (
                        <tr key={atributo.id}>
                          <td>{atributo.nombre}</td>
                          <td>{atributo.tipo}</td>
                          <td>{atributo.obligatorio ? "Si" : "No"}</td>
                          <td>{atributo.decimales}</td>
                          <td>{atributo.caracteres}</td>
                          <td>{atributo.maximo}</td>
                          <td>{atributo.minimo}</td>
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
        <div className="alert alert-warning">
          No se encontraron tipos de procesos
        </div>
      )}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${resultsPage.first ? "disabled" : ""}`}>
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
      </nav>
    </div>
  );
}

export default ListarTiposDeProcesos;
