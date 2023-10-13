import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProcesoProgramado } from "../types/procesoProgramado";
import { useNotifications } from "../Menu";
import AutoComplete from "./AutoComplete";
import authHeader from "../services/auth-header";

function AgendaGeneralDeProcesos() {
  const [lotes, setLotes] = useState<ProcesoProgramado[]>([]);
  const [codigos, setCodigos] = useState<string[]>([]);
  const [proceso, setProceso] = useState("");
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [errores, setErrores] = useState<string[]>([]); // Estado para rastrear errores por fila
  const [erroresc, setErroresc] = useState(0);

  const navigate = useNavigate();
  const { notifications, updateNotifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterText, setFilterText] = useState(0); // Valor predeterminado: "Todos"

  useEffect(() => {
    fetch(`/lotes/procesosPendientes?term=${searchTerm}&dia=${filterText}`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLotes(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [filterText]);

  const handleBuscarLote = () => {
    fetch(`/lotes/procesosPendientes?term=${searchTerm}&dia=${filterText}`, {
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        setLotes(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      <h3>Agenda de Procesos Pendientes :</h3>
      <div className="row align-items-center">
        <div className="d-flex col-3">
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
        &nbsp;&nbsp; &nbsp;&nbsp;
        <div className="col-lg-3 ">
          <select onChange={handleFilterChange} className="form-select">
            <option value="Hoy">Hoy</option>
            <option value="Mañana">Mañana</option>
            <option value="Dentro de 3 días">Dentro de 3 días</option>
            <option value="Dentro de 7 días">Dentro de 7 días</option>
          </select>
        </div>
        <div className="col-lg-3 ">
          <input
            className="form-check-input form-check-lg"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            onClick={handleLoteChange1}
            style={{ transform: "scale(1.5)" }} // Aumenta el tamaño del checkbox
          />
          &nbsp;&nbsp;
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Seleccionar varios
          </label>
        </div>
        <div className="col-auto">
          {showCheckbox ? (
            <button
              type="button"
              className="btn btn-custom-color-1 "
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
          {lotes.map((lote, index) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AgendaGeneralDeProcesos;
