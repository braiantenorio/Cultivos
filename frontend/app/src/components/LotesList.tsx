import { Link } from "react-router-dom";
import { Lote } from "../types/lote";
import React, { useEffect, useState } from "react";

function Loteslist() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regla, setRegla] = useState(false);

  useEffect(() => {
    fetch(`/lotes?term=${searchTerm}`)
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Utiliza una expresión regular para validar que el input contenga solo números y letras
    const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue);

    if (isValidInput) {
      setSearchTerm(inputValue);
      setRegla(false);
    } else {
      setRegla(true);
    }
  };

  const handleBuscarLote = () => {
    fetch(`/lotes?term=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setLotes(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h2>Lotes </h2>
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
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleBuscarLote}
          >
            Buscar
          </button>
          {regla && (
            <div className="alert alert-danger alert-sm">
              Solo Letras o Numeros
            </div>
          )}
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Codigo</th>
            <th>Cantidad</th>
            <th>Categoria</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote, index) => (
            <tr key={lote.id}>
              <td>{index + 1}</td>
              <td>{lote.codigo}</td>
              <td>{lote.cantidad}</td>
              <td>{lote.categoria.nombre}</td>
              <td>
                <Link
                  //    to={`/lotes/${lote.id}`}
                  to={`/lotes/${lote.codigo}`}
                  className="btn btn-sm btn-info me-2"
                >
                  Detalle
                </Link>
                <Link
                  to={`/lotes/${lote.id}/edit`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
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
