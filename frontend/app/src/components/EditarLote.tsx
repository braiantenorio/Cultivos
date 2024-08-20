import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Categoria } from "../types/categoria";
import authHeader from "../services/auth-header";

const EditarLote: React.FC = () => {
  const [cantidadError, setCantidadError] = useState("");
  const { loteId } = useParams();
  const [lote, setLote] = useState({
    codigo: "",
    cantidad: 0,
    categoria: { id: 0, nombre: "", codigo: 0 },
    cultivar: { id: 0, nombre: "", codigo: 0 },
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/lotes/id/${loteId}`;

    fetch(url, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLote(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const categoriasUrl = "/categorias/search";
    fetch(categoriasUrl, {
      headers: authHeader(),
    })
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
  }, [loteId]);

  const handleNumeroSecuenciaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    // Validar que el valor ingresado sea un número
    if (/^\d*$/.test(value)) {
      // Limpiar el mensaje de error
      setCantidadError("");

      // Actualizar el código con el nuevo valor
      const nuevoCodigo = lote.codigo
        .split("-")
        .map((num, index) => (index === 2 ? value : num))
        .join("-");
      setLote((prevLote) => ({
        ...prevLote,
        codigo: nuevoCodigo,
      }));
    } else {
      // Si el valor no es un número, mostrar el error
      setCantidadError("El valor debe ser un número.");
    }
  };

  const handleGuardarLote = () => {
    const url = `/lotes`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(lote),
    })
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
        console.log("Lote actualizado:", responseData);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud PUT:", error);
        if (error.message === "Error de solicitud incorrecta (BadRequest)") {
          setCantidadError("La cantidad es incorrecta. Verifique los valores.");
        } else {
          setCantidadError("Ya existe un lote con ese número de secuencia.");
        }
      });
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  const tercerNumeroSecuencia = lote.codigo.split("-")[2] || "";

  return (
    <div className="container">
      <h1>Editar Lote</h1>
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
            value={lote.codigo}
            readOnly
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
            value={lote.cantidad}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cultivarId" className="form-label">
            Cultivar:
          </label>
          <input
            className="form-select"
            id="cultivarId"
            name="cultivarId"
            value={lote.cultivar.nombre + " (" + lote.cultivar.codigo + ")"}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoriaId" className="form-label">
            Categoría:
          </label>
          <input
            className="form-select"
            id="categoriaId"
            name="categoriaId"
            value={lote.categoria.nombre + " (" + lote.categoria.codigo + ")"}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="numeroSecuencia" className="form-label">
            Número de Secuencia:
          </label>
          <input
            type="text" // Cambiar a "text" para aceptar solo dígitos y permitir validación
            className="form-control"
            id="numeroSecuencia"
            name="numeroSecuencia"
            value={tercerNumeroSecuencia}
            onChange={handleNumeroSecuenciaChange}
          />
          {cantidadError && (
            <div className="alert alert-danger">{cantidadError}</div>
          )}
        </div>
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleGuardarLote}
            disabled={tercerNumeroSecuencia === ""}
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

export default EditarLote;
