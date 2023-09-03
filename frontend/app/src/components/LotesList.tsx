import { Link } from "react-router-dom";
import { Lote } from "../types/lote";
import React, { useEffect, useState } from "react";

function Loteslist() {
  const [lotes, setLotes] = useState<Lote[]>([]);

  useEffect(() => {
    const url = "/lotes";

    fetch(url)
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

  return (
    <div>
      <h2>
        Lotes{" "}
        <Link to="/lotes/crear-lote" className="btn btn-primary ms-3">
          Crear Lote
        </Link>
      </h2>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Loteslist;
