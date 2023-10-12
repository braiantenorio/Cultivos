import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lote } from "../types/lote";
import authHeader from "../services/auth-header";

function Loteslist() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regla, setRegla] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false); // Estado para mostrar/ocultar elementos eliminados

  useEffect(() => {
    fetch(`/lotes?term=${searchTerm}`, {
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
  }, []); // Agrega showDeleted como dependencia para que se actualice al cambiar el estado

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue);

    if (isValidInput) {
      setSearchTerm(inputValue);
      setRegla(false);
    } else {
      setRegla(true);
    }
  };

  const handleBuscarLote = () => {
    fetch(`/lotes?filtered=${showDeleted}&term=${searchTerm}`, {
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

  const handleShowDeletedChange = () => {
    setShowDeleted(!showDeleted); // Alternar entre mostrar y ocultar elementos eliminados
  };

  return (
    <div className="container">
      <h2>Lotes</h2>
      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <input
            type="search"
            placeholder="Buscar Lote por código"
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="form-control"
          />
        </div>
        <div
          className="col-auto"
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
          onClick={handleBuscarLote}
        >
          <i className="bi bi-search bi-lg text-primary"></i>
        </div>
        <div className="col-auto">
          {regla && (
            <div className="alert alert-danger alert-sm">
              Solo Letras o Números
            </div>
          )}
        </div>
        <div className="col-auto">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showDeleted}
              onChange={handleShowDeletedChange}
            />
            Mostrar Eliminados
          </label>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote, index) => (
            <tr key={lote.id}>
              <td>{index + 1}</td>
              <td>
                {" "}
                <span className="badge bg-primary text-white me-2 fs-6">
                  {lote.codigo}
                </span>
              </td>
              <td>{lote.cantidad}</td>
              <td>{lote.categoria.nombre}</td>
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
      {!lotes.length && (
        <div className="alert alert-warning">No se encontraron lotes</div>
      )}
    </div>
  );
}

export default Loteslist;
