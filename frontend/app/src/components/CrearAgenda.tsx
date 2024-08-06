import React, { useEffect, useState } from "react";
import { Categoria } from "../types/categoria";
import { useNavigate, useParams } from "react-router-dom";
import { ProcesoProgramado } from "../types/procesoProgramado";
import { TipoDeProceso } from "../types/tipoDeProceso";
import authHeader from "../services/auth-header";

function CrearAgenda() {
  const navigate = useNavigate();

  const [cantidadError, setCantidadError] = useState("");
  const [tipo, setTipo] = useState("Crear Agenda");
  const { id } = useParams();
  const [tipoAgenda, setTipoAgenda] = useState({
    categoria: {} as Categoria,
    version: "",
    procesosProgramado: [] as {
      fechaARealizar: Date;
      frecuencia: number;
      cantidad: number;
      diaInicio: number;
      completado: boolean;
      proceso: TipoDeProceso;
    }[],
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
  }, []);

  const agregarProcesoProgramado = () => {
    const nuevoProceso = {
      fechaARealizar: new Date(),
      frecuencia: 0,
      cantidad: 0,
      diaInicio: 0,
      completado: false,
      proceso: {} as TipoDeProceso,
    };

    setTipoAgenda((prevAgenda) => ({
      ...prevAgenda,
      procesosProgramado: [...prevAgenda.procesosProgramado, nuevoProceso],
    }));
  };

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  useEffect(() => {
    const url = "/categorias/search";

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
        setCategorias(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (id != "new") {
      // Realiza una solicitud al servidor para obtener los datos de la agenda por su ID
      setTipo("Detalle agenda");
      fetch(`/tipoagendas/id/${id}`, {
        headers: authHeader(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al realizar la solicitud: ${response.status}`
            );
          }
          return response.json();
        })
        .then((responseData) => {
          setTipoAgenda(responseData.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const guardarAgenda = () => {
    fetch(`/tipoagendas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(tipoAgenda),
    })
      .then((response) => {
        if (!response.ok) {
          // Es un error BadRequest
          throw new Error("Error de solicitud incorrecta (BadRequest)");
        }

        response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al crear la agenda:", error);
        setCantidadError("esta version ya existe");
      });
  };

  const handleInputChange = (
    index: number,
    field: keyof ProcesoProgramado,
    value: string
  ) => {
    const updatedProcesos = [...tipoAgenda.procesosProgramado];
    const procesoToUpdate = updatedProcesos[index];

    if (
      field === "frecuencia" ||
      field === "cantidad" ||
      field === "diaInicio"
    ) {
      procesoToUpdate[field] = parseInt(value as string, 10);
    } else if (field === "proceso") {
      // Actualiza el objeto proceso con el tipo de proceso seleccionado
      procesoToUpdate.proceso =
        tiposDeProcesos.find((proceso) => proceso.id === parseInt(value)) ||
        ({} as TipoDeProceso);
    }

    setTipoAgenda({ ...tipoAgenda, procesosProgramado: updatedProcesos });
  };

  const handleCategoriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    const selectedCategoria = categorias.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );

    setTipoAgenda((prevLote) => ({
      ...prevLote,
      categoria: selectedCategoria || {
        id: 0,
        nombre: "",
        codigo: 0,
        subCategorias: [],
        deleted: false,
      },
    }));
  };

  const eliminarProcesoProgramado = (index: number) => {
    const procesosActualizados = [...tipoAgenda.procesosProgramado];
    procesosActualizados.splice(index, 1); // Elimina el proceso programado en la posición 'index'
    setTipoAgenda({ ...tipoAgenda, procesosProgramado: procesosActualizados });
  };

  const handleCancelar = () => {
    // Redirige al link anterior
    navigate(-1);
  };

  return (
    <div className="container">
      <form>
        <h2>
          <div className="mb-3 row align-items-center">
            <div className="mb-2 col-12 col-md-6 col-lg-3">{tipo} &nbsp;</div>
            {"  "}

            <div className="col-12 col-md-6 col-lg-3">
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalToggle"
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
            </div>
          </div>
        </h2>

        <div className="mb-3 col-md-6 col-sm-12">
          <label htmlFor="categoria" className="form-label">
            Para La Categoría:
          </label>
          <select
            className="form-select"
            id="categoria"
            name="categoria"
            value={tipoAgenda.categoria.id}
            onChange={handleCategoriaChange}
            disabled={tipo === "Detalle agenda"}
          >
            <option value={0}>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-md-6 col-sm-12">
          <label htmlFor="fechaInicio" className="form-label">
            Version:
          </label>
          <input
            type="text"
            className="form-control"
            id="fechaInicio"
            value={tipoAgenda.version}
            disabled={tipo === "Detalle agenda"}
            onChange={(e) =>
              setTipoAgenda({ ...tipoAgenda, version: e.target.value })
            }
          />
          {cantidadError && (
            <div className="alert alert-danger">{cantidadError}</div>
          )}
        </div>
        <h3>
          <div className="row">
            <div className="col-6 col-md-4 col-lg-4">Procesos Programados</div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-primary"
                onClick={agregarProcesoProgramado}
                disabled={tipo === "Detalle agenda"}
              >
                Agregar
              </button>
            </div>
          </div>
        </h3>
      </form>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>
                Proceso
                <span className="invisible-text">
                  .....................................
                </span>
              </th>
              <th>
                Día de Inicio
                <span className="invisible-text">................</span>
              </th>
              <th>
                Repetir <span className="invisible-text">...............</span>
              </th>
              <th>Intervalo de días</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tipoAgenda.procesosProgramado.map((proceso, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="form-select"
                    id={`validationCustom04-${index}`}
                    required
                    value={proceso.proceso.id || ""}
                    onChange={(e) => {
                      handleInputChange(index, "proceso", e.target.value);
                    }}
                    disabled={tipo === "Detalle agenda"}
                  >
                    <option value="" disabled hidden>
                      Choose...
                    </option>
                    {tiposDeProcesos.map((proceso) => (
                      <option key={proceso.id} value={proceso.id}>
                        {proceso.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="diaInicio"
                    value={proceso.diaInicio}
                    disabled={tipo === "Detalle agenda"}
                    onChange={(e) =>
                      handleInputChange(index, "diaInicio", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="cantidad"
                    value={proceso.cantidad}
                    onChange={(e) =>
                      handleInputChange(index, "cantidad", e.target.value)
                    }
                    disabled={tipo === "Detalle agenda"}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="frecuencia"
                    value={proceso.frecuencia}
                    onChange={(e) =>
                      handleInputChange(index, "frecuencia", e.target.value)
                    }
                    disabled={
                      proceso.cantidad <= 1 || tipo === "Detalle agenda"
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => eliminarProcesoProgramado(index)}
                    title="Eliminar"
                    disabled={tipo === "Detalle agenda"}
                  >
                    <i
                      className="bi bi-trash"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {" "}
              <h5 className="modal-title ">
                ¿ESTAS SEGURO?
                <i className="bi bi-exclamation-triangle"></i>
              </h5>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning" role="alert">
                Una vez creado, no podrás editar esta agenda más tarde.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={guardarAgenda}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearAgenda;
