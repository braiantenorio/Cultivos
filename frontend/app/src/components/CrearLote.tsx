import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/categoria";
import { Lote } from "../types/lote";
import { Cultivar } from "../types/cultivar";

const CrearLote: React.FC = () => {
  const [cantidadError, setCantidadError] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [nuevoLote, setNuevoLote] = useState<Lote>({} as Lote);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const navigate = useNavigate();
  const requestOptions = {
    method: "POST", // Método de la solicitud POST
    headers: {
      "Content-Type": "application/json", // Tipo de contenido del cuerpo de la solicitud
    },
    body: JSON.stringify(nuevoLote), // Convierte el objeto en formato JSON y lo establece como el cuerpo de la solicitud
  };
  const [selectsHabilitados, setSelectsHabilitados] = useState({
    cultivar: true,
    // lotePadre: true,
  });

  useEffect(() => {
    const url = "/categorias";
    const url1 = "/cultivares";

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
    fetch(url1)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setCultivares(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const buscarLotesActivosPorCategoria = (categoria: Categoria | undefined) => {
    if (categoria) {
      fetch(`/lotes/activos/${categoria.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al realizar la solicitud: ${response.status}`
            );
          }
          return response.json();
        })
        .then((responseData) => {
          setLotes(responseData.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

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
      categoria: selectedCategoria || { id: 0, nombre: "", codigo: 0 },
    }));
    buscarLotesActivosPorCategoria(selectedCategoria);
  };
  const handleCultivarChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    const selectedCategoria = cultivares.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );

    setNuevoLote((prevLote) => ({
      ...prevLote,
      cultivar: selectedCategoria || { id: 0, nombre: "", codigo: 0 },
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
    setSelectsHabilitados((prevSelects) => ({
      ...prevSelects,
      cultivar: selectdlote === undefined,
    }));
    setNuevoLote((prevLote) => ({
      ...prevLote,
      cultivar: selectdlote?.cultivar || { id: 0, nombre: "", codigo: 0 },
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
            value={nuevoLote.categoria?.id}
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
          <label htmlFor="categoria" className="form-label">
            Cultivar:
          </label>
          <select
            className="form-select"
            id="cultivar"
            name="cultivar"
            value={nuevoLote.cultivar?.id}
            onChange={handleCultivarChange}
            disabled={!selectsHabilitados.cultivar}
          >
            <option value={0}></option>
            {cultivares.map((categoria) => (
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
              nuevoLote.categoria === undefined ||
              nuevoLote.cultivar === undefined
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
