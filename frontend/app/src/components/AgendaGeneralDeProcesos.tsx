import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProcesoProgramado } from "../types/procesoProgramado";
import { useNotifications } from "../Menu";
import AutoComplete from "./AutoComplete";
import authHeader from "../services/auth-header";
import { ResultsPage } from "../types/ResultsPage";

function AgendaGeneralDeProcesos() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const longitud = parseInt(queryParams.get("longitud")!, 10);
  const pagina = parseInt(queryParams.get("pagina")!, 10);
  const [lotes, setLotes] = useState<ProcesoProgramado[]>([]);
  const [codigos, setCodigos] = useState<string[]>([]);
  const [proceso, setProceso] = useState("");
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [errores, setErrores] = useState<string[]>([]); // Estado para rastrear errores por fila
  const [erroresc, setErroresc] = useState(0);

  const navigate = useNavigate();
  const { notifications, updateNotifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterText, setFilterText] = useState(0);
  const [resultsPage, setResultsPage] = useState<
    ResultsPage<ProcesoProgramado>
  >({
    content: [],
    totalPages: 0,
    last: false,
    first: true,
    size: longitud, // Usamos 0 como valor predeterminado si no se puede convertir a entero
    number: pagina - 1, // Usamos 0 como valor predeterminado si no se puede convertir a entero
  });

  useEffect(() => {
    navigate(
      `/agenda/general?pagina=${resultsPage.number + 1}&longitud=${
        resultsPage.size
      }`
    );
    handleBuscarLote();
  }, [filterText, resultsPage.number, resultsPage.size]);

  const handleBuscarLote = () => {
    fetch(
      `/lotes/procesosPendientes?term=${searchTerm}&dia=${filterText}&page=${resultsPage.number}&size=${resultsPage.size}`,
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

  const handleLoteChange = (
    procesoNombre: string,
    procesot: string,
    isChecked: boolean,
    rowIndex: number // Agregar índice de fila como argumento
  ) => {
    const newErrores = [...errores]; // Copiar el array de errores existente
    if (proceso === procesot || codigos.length === 0) {
      setProceso(procesot);
      newErrores[rowIndex] = "";
    } else {
      newErrores[rowIndex] = "Diferente proceso";
      setErroresc(erroresc + 1);
    }

    if (isChecked) {
      // Agrega lote.lote al array codigos
      setCodigos((prevCodigos) => [...prevCodigos, procesoNombre]);
    } else {
      // Si el checkbox está desmarcado, elimina lote.lote del array codigos
      setCodigos((prevCodigos) =>
        prevCodigos.filter((codigo) => codigo !== procesoNombre)
      );

      if (newErrores[rowIndex] !== "") {
        newErrores[rowIndex] = "";
        setErroresc(erroresc - 1);
      }
    }

    setErrores(newErrores);
  };

  const handleLoteChange1 = () => {
    setShowCheckbox(!showCheckbox);
    setErrores([]);
  };

  const handleLoteChange2 = () => {
    updateNotifications(notifications, codigos);
    navigate(`/lotes/${codigos[0]}/procesos/${proceso}`);
  };

  const handleOptionSelect = (option: React.SetStateAction<string>) => {
    setSearchTerm(option);
  };
  const handleFilterChange = (event: { target: { value: any } }) => {
    const filterTexts = event.target.value;
    setFilterText(findFilterIndex(filterTexts));
  };
  const findFilterIndex = (filterValue: string) => {
    const filters = [
      "Hoy",
      "Mañana",
      "2",
      "Dentro de 3 días",
      "4",
      "5",
      "6",
      "Dentro de 7 días",
    ];
    return filters.indexOf(filterValue);
  };

  return (
    <div className="container">
      <h3 className="mb-2">Agenda de Procesos Pendientes:</h3>

      <div className="row align-items-center">
        <div className="col-12 col-md-6 col-lg-3  mb-md-0">
          <div className="d-flex align-items-center">
            <AutoComplete onOptionSelect={handleOptionSelect} />
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
        &nbsp;&nbsp; &nbsp;&nbsp;
        <div className="col-lg-3 mb-2 mb-lg-0">
          <select onChange={handleFilterChange} className="form-select">
            <option value="Hoy">Hoy</option>
            <option value="Mañana">Mañana</option>
            <option value="Dentro de 3 días">Dentro de 3 días</option>
            <option value="Dentro de 7 días">Dentro de 7 días</option>
          </select>
        </div>
        <div className="row col-lg-4 align-items-center mb-3">
          <div className="col-8 col-md-9 d-flex align-items-center">
            <div className="form-check d-flex align-items-center form-switch">
              <input
                className="form-check-input form-check-lg ms-0 mt-3 "
                type="checkbox"
                value=""
                id="flexCheckDefault"
                onClick={handleLoteChange1}
                style={{ transform: "scale(1.5)" }} // Aumenta el tamaño del checkbox
              />
              &nbsp;&nbsp;&nbsp;
              <label
                className="form-check-label mt-3"
                htmlFor="flexCheckDefault"
              >
                Seleccionar varios
              </label>
            </div>
          </div>
          <div className="col-3 col-md-3">
            {showCheckbox ? (
              <button
                type="button"
                className="btn btn-custom-color-1 mt-3"
                onClick={handleLoteChange2}
                disabled={codigos.length === 0 || erroresc !== 0}
              >
                Completar
              </button>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha Programada</th>
              <th>Proceso</th>
              <th>Lote</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultsPage.content.map((lote, index) => {
              const isToday =
                new Date(
                  new Date(lote.fechaARealizar).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString() === new Date().toLocaleDateString();
              const isPastDate =
                new Date(lote.fechaARealizar) <
                new Date(new Date().toDateString());

              return (
                <tr
                  key={index}
                  className={
                    isToday
                      ? "table-warning" // Hoy (fondo verde)
                      : isPastDate
                      ? "table-danger" // Antes de hoy (fondo rojo)
                      : "table-primary"
                  }
                >
                  <td>{index + 1}</td>
                  <td>
                    {new Date(
                      new Date(lote.fechaARealizar).getTime() +
                        24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td>{lote.proceso.nombre}</td>
                  <td>
                    {" "}
                    <span className="badge badge-custom-1 text-white me-2 fs-6">
                      {lote.lote}
                    </span>
                  </td>
                  <td>
                    {isPastDate && showCheckbox ? (
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={lote.proceso.nombre}
                        id={`${lote.proceso.nombre}Checkbox`}
                        onChange={(e) =>
                          handleLoteChange(
                            lote.lote,
                            lote.proceso.nombre,
                            e.target.checked,
                            index
                          )
                        }
                        style={{ transform: "scale(1.5)" }}
                      />
                    ) : isPastDate && !showCheckbox ? (
                      <Link
                        to={`/lotes/${lote!.lote}/procesos/${
                          lote.proceso.nombre
                        }`}
                        className="btn btn-custom-color-1 btn-sm ms-2"
                      >
                        Completar
                      </Link>
                    ) : null}
                  </td>
                  <td>
                    {errores[index] && (
                      <div className="alert alert-danger alert-sm">
                        {errores[index]}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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

export default AgendaGeneralDeProcesos;
