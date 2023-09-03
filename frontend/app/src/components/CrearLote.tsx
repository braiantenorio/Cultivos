import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/categoria";

const CrearLote: React.FC = () => {
  const [nuevoLote, setNuevoLote] = useState({
    codigo: "",
    cantidad: 0,
    categoria: { id: 0, nombre: "" }, // Inicialmente, no hay categoría seleccionada
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Almacenar las categorías obtenidas del backend
  const navigate = useNavigate(); // Obtener la función de navegación
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

  const handleGuardarLote = () => {
    // Envía una solicitud POST para crear un nuevo lote
    const url = "/lotes";
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Respuesta del servidor:", responseData);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST:", error);
      });
  };

  const handleCancelar = () => {
    // Redirige al link anterior
    navigate(-1);
  };

  return (
    <div>
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
            <option value={0}>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleGuardarLote}
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
