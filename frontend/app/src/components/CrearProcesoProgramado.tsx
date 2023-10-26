import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authHeader from "../services/auth-header";
import { ProcesoProgramado } from "../types/procesoProgramado";
import { TipoDeProceso } from "../types/tipoDeProceso";

function CrearProcesoProgramado() {
  const navigate = useNavigate();
  const { loteId } = useParams();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [cantidadError, setCantidadError] = useState("");
  const [procesoProgramado, setProcesoProgramado] = useState({
    fechaARealizar: tomorrow, // Inicializa con la fecha de mañana
    proceso: {} as TipoDeProceso,
    completado: false,
    frecuencia: 0,
    cantidad: 0,
    diaInicio: 0,
  });

  const [tiposDeProcesos, setTipoDeProceso] = useState<TipoDeProceso[]>([]);
  useEffect(() => {
    const url = "/listaDeAtributos/search";

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
        setTipoDeProceso(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(procesoProgramado);
  }, []);

  const guardarCultivar = () => {
    // Continuar con la lógica de guardar
    fetch(`/lotes/${loteId}/procesoprogramado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(procesoProgramado),
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
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTipoProcesoChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    const selectedCategoria = tiposDeProcesos.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );

    setProcesoProgramado((prevLote) => ({
      ...prevLote,
      proceso: selectedCategoria || {
        id: 0,
        nombre: "",
        atributos: [],
      },
    }));
  };

  const handleFechaARealizarChange = (event: {
    target: { value: string | number | Date };
  }) => {
    // Obtén la fecha seleccionada del evento
    const newDate = new Date(event.target.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    // Actualiza el estado
    if (newDate <= fechaActual) {
      setCantidadError("La fecha debe ser después de hoy.");
    } else {
      setCantidadError(""); // Limpiar el mensaje de error
    }
    setProcesoProgramado({
      ...procesoProgramado,
      fechaARealizar: newDate,
    });
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <form>
        <h2>Crear Proceso Programado</h2>
        <div className="mb-3 col-5">
          <label htmlFor="fechaInicio" className="form-label">
            Fecha:
          </label>
          <input
            type="date"
            className="form-control"
            id="codigo"
            name="codigo"
            value={procesoProgramado.fechaARealizar.toISOString().split("T")[0]} // Formatea la fecha como cadena
            onChange={handleFechaARealizarChange}
          />
          {cantidadError && (
            <div className="alert alert-danger">{cantidadError}</div>
          )}
        </div>
        <div className="mb-3 col-5">
          <label htmlFor="proceso" className="form-label">
            Tipo de Proceso
          </label>
          <select
            className="form-select"
            id="proceso"
            name="proceso"
            value={procesoProgramado?.proceso?.id}
            onChange={handleTipoProcesoChange}
          >
            <option value="">Selecciona el tipo de proceso...</option>
            {tiposDeProcesos.map((proceso) => (
              <option key={proceso.id} value={proceso.id}>
                {proceso.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn-success"
          onClick={guardarCultivar}
          disabled={
            cantidadError !== "" ||
            procesoProgramado.proceso.id === undefined ||
            procesoProgramado.proceso.id === 0
          }
        >
          Guardar
        </button>
        &nbsp;&nbsp;
        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={handleCancelar}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default CrearProcesoProgramado;
