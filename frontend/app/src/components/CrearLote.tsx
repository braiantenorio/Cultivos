import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/categoria";
import { Lote } from "../types/lote";

const CrearLote: React.FC = () => {
  const [cantidadError, setCantidadError] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [nuevoLote, setNuevoLote] = useState<{
    codigo: string;
    cantidad: number;
    lotePadre?: Lote | undefined;
    categoria: { id: number; nombre: string };
  }>({
    codigo: "",
    cantidad: 0,
    lotePadre: undefined,
    categoria: { id: 0, nombre: "" },
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();
  const requestOptions = {
    method: "POST", // Método de la solicitud POST
    headers: {
      "Content-Type": "application/json", // Tipo de contenido del cuerpo de la solicitud
    },
    body: JSON.stringify(nuevoLote), // Convierte el objeto en formato JSON y lo establece como el cuerpo de la solicitud
  };

  useEffect(() => {
    const url = "/categorias";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setCategorias(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch(`/lotes/activos`)
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNuevoLote((prevLote) => ({
      ...prevLote,
      [name]: value,
    }));
  };

  const handleCategoriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    const selectedCategoria = categorias.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );

    setNuevoLote((prevLote) => ({
      ...prevLote,
      categoria: selectedCategoria || { id: 0, nombre: "" },
    }));
  };

  const handleLoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectdlote = lotes.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );

    setNuevoLote((prevLote) => ({
      ...prevLote,
      lotePadre: selectdlote as Lote,
    }));
  };

  const handleGuardarLote = () => {
    // Envía una solicitud POST para crear un nuevo lote
    const url = "/lotes";
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            // Es un error BadRequest
            throw new Error("Error de solicitud incorrecta (BadRequest)");
          } else {
            // Otro tipo de error
            throw new Error(
              `Error al realizar la solicitud: ${response.status}`
            );
          }
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Respuesta del servidor:", responseData);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST:", error);

        if (error.message === "Error de solicitud incorrecta (BadRequest)") {
          setCantidadError("La cantidad es incorrecta. Verifique los valores.");
        } else {
          setCantidadError("Se produjo un error al realizar la solicitud.");
        }
      });
  };

  const handleCancelar = () => {
    // Redirige al link anterior
    navigate(-1);
  };

  return (
    <div className="container">
      <h1>Crear Nuevo Lote</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="codigo" className="form-label">
            Código:
          </label>
          <input
            type="text"
            className="form-control"
            id="codigo"
            name="codigo"
            value={nuevoLote.codigo}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cantidad" className="form-label">
            Cantidad:
          </label>
          <input
            type="number"
            className="form-control"
            id="cantidad"
            name="cantidad"
            value={nuevoLote.cantidad}
            onChange={handleInputChange}
          />
          {cantidadError && (
            <div className="alert alert-danger">{cantidadError}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">
            Categoría:
          </label>
          <select
            className="form-select"
            id="categoria"
            name="categoria"
            value={nuevoLote.categoria.id}
            onChange={handleCategoriaChange}
          >
            <option value={0}></option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="lotePadre" className="form-label">
            Lote Predecesor
          </label>
          <select
            className="form-select"
            id="lotePadre"
            name="lotePadre"
            value={nuevoLote.lotePadre?.id || 0}
            onChange={handleLoteChange}
          >
            <option value={0}></option>
            {lotes.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.codigo} - {categoria.categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleGuardarLote}
            disabled={
              nuevoLote.codigo === "" ||
              nuevoLote.cantidad < 1 ||
              nuevoLote.categoria.id === 0 ||
              (nuevoLote.categoria.nombre !== "Planta Madre" &&
                nuevoLote.lotePadre === undefined)
            }
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={handleCancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearLote;
