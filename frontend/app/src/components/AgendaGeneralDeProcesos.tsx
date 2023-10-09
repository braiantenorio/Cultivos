import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProcesoProgramado } from "../types/procesoProgramado";
import { LoteCodigo } from "../types/loteCodigo";
import { useNotifications } from "../Menu";

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
  const [searchTerm1, setSearchTerm1] = useState("");

  useEffect(() => {
    fetch(`/lotes/procesosPendientes?lote=${searchTerm}&proceso=${searchTerm1}`)
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
  }, []);

  const handleBuscarLote = () => {
    fetch(`/lotes/procesosPendientes?lote=${searchTerm}&proceso=${searchTerm1}`)
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
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
  };
  const handleSearchInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm1(inputValue);
  };

  return (
    <div className="container">
      <h3>Agenda de Procesos Pendientes :</h3>
      <div className="row align-items-center">
        <div className="col-auto">
          <input
            type="search"
            placeholder="Buscar Lote "
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <i
            className="bi bi-search bi-lg text-primary"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleBuscarLote}
          ></i>
        </div>
        <div className="col-auto">
          <input
            type="search"
            placeholder="Buscar proceso"
            value={searchTerm1}
            onChange={handleSearchInputChange1}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <i
            className="bi bi-search bi-lg text-primary"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleBuscarLote}
          ></i>
        </div>
        &nbsp;&nbsp; &nbsp;&nbsp;
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
              className="btn btn-primary"
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
          {lotes.map((lote, index) => (
            <tr key={lote.id}>
              <td>{index + 1}</td>
              <td>
                {new Date(
                  new Date(lote.fechaARealizar).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </td>
              <td>{lote.proceso.nombre}</td>
              <td>{lote.lote}</td>
              <td>
                {showCheckbox ? (
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
                        index // Pasar el índice de fila
                      )
                    }
                    style={{ transform: "scale(1.5)" }}
                  />
                ) : (
                  <Link
                    to={`/lotes/${lote!.lote}/procesos/${lote.proceso.nombre}`}
                    className="btn btn-primary btn-sm ms-2"
                  >
                    Completar
                  </Link>
                )}
              </td>
              <td>
                {errores[index] && ( // Mostrar el mensaje de error solo si hay un error en esta fila
                  <div className="alert alert-danger alert-sm">
                    {errores[index]}
                  </div>
                )}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgendaGeneralDeProcesos;
