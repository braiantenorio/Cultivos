import React, { useState, useEffect } from "react";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import { Link } from "react-router-dom";

function BuscarLote() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lote, setLote] = useState<Lote | null>(null);
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [regla, setRegla] = useState(false);

  useEffect(() => {
    fetch(`/lotes/${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setLote(data.data);

        const registrosDeProcesosUrl = `/registros-de-procesos/lotes/${data.data.id}`;
        setProcesos([]);

        fetch(registrosDeProcesosUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error al realizar la solicitud: ${response.status}`
              );
            }
            return response.json();
          })
          .then((responseData) => {
            setProcesos(responseData.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchTerm]);

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

  return (
    <div className="mb-3 container">
      <input
        type="text"
        placeholder="Buscar Lote"
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="form-control"
      />
      {regla && <div className="alert alert-danger">Solo Letras o Numeros</div>}
      {searchTerm !== "" && lote === null ? (
        <div>
          <div className="alert alert-danger">Lote No Encontrado</div>
        </div>
      ) : lote ? (
        <div>
          <h2>Detalle del Lote</h2>
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              ID del Lote:
            </span>{" "}
            {lote.id}
          </p>
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Código:
            </span>{" "}
            {lote.codigo}
          </p>
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Cantidad:
            </span>{" "}
            {lote.cantidad}
          </p>
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Categoría:
            </span>{" "}
            {lote.categoria.nombre}
          </p>

          <h3>Procesos :</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {procesos.map((proceso) => (
                <tr key={proceso.id}>
                  <td>{proceso.id}</td>
                  <td>{proceso.id}</td> {/* aca lo mismo, iba el nombre del proceso y la descripcion, ahora cambiamos el modelo de datos */}
                  <td>{proceso.id}</td>
                  <td>
                    <Link
                      to={`/lotes/${lote.id}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
export default BuscarLote;
