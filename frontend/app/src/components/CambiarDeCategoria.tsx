import { useEffect, useState } from "react";
import { Lote } from "../types/lote";
import authHeader from "../services/auth-header";
import { useNavigate, useParams } from "react-router-dom";
import { Categoria } from "../types/categoria";
import { LotesCategoria } from "../types/LotesCategoria";
import { TipoAgenda } from "../types/tipoAgenda";
import { Agenda } from "../types/agenda";

function CambiarDeCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidadError, setCantidadError] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [huboError, setHuboError] = useState(false);
  const [lote, setLote] = useState<Lote>({} as Lote);
  const [tipoAgendas, setTipoAgendas] = useState<TipoAgenda[]>([]);
  const [lotesCategoria, setLotesCategoria] = useState({
    lotes: [] as {
      cantidad: number;
      categoria: Categoria;
      agenda: Agenda;
    }[],
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    fetch(`/lotes/codigo/${id}`, {
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
        fetch(`/categorias/id/${responseData.data.categoria.id}`, {
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
            setCategorias(responseData.data.subCategorias);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    fetch(`/tipoagendas/search`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setTipoAgendas(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const agregarProcesoProgramado = () => {
    const lote = {
      cantidad: 0,
      categoria: {} as Categoria,
      agenda: {} as Agenda,
    };
    setLotesCategoria((prevAgenda) => ({
      ...prevAgenda,
      lotes: [...prevAgenda.lotes, lote],
    }));
  };
  const handleInputChange = (
    index: number,
    field: keyof Lote,
    value: string
  ) => {
    const updatedProcesos = [...lotesCategoria.lotes];
    const procesoToUpdate = updatedProcesos[index];

    if (field === "cantidad") {
      procesoToUpdate[field] = parseInt(value as string, 10);
    } else if (field === "categoria") {
      // Actualiza el objeto proceso con el tipo de proceso seleccionado
      procesoToUpdate.categoria =
        categorias.find((proceso) => proceso.id === parseInt(value)) ||
        ({} as Categoria);
    }
    if (field === "agenda") {
      const agenda: Agenda = {
        id: 0,
        procesosProgramado: [],
        tipoAgenda:
          tipoAgendas.find((proceso) => proceso.id === parseInt(value)) ||
          ({} as TipoAgenda),
      };
      procesoToUpdate.agenda = agenda;
    }

    setLotesCategoria({ ...lotesCategoria, lotes: updatedProcesos });
  };

  const handleGuardarLote = () => {
    setHuboError(false);
    fetch(`/lotes/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(lotesCategoria),
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
        setLotes(responseData.data);
        console.log("Respuesta del servidor:", responseData);
        // Obtiene la fecha actual en formato ISO (yyyy-mm-dd)
        const today = new Date().toISOString().split("T")[0];

        // Filtra los procesos programados con fecha igual a la de hoy
        /*    const procesosHoy = responseData.data.agenda.procesosProgramado.filter(
          (proceso: { fechaARealizar: string }) =>
            proceso.fechaARealizar === today
        ); */
        //    updateNotifications(notifications + procesosHoy.length, []);
        //    setCodigoLoteGenerado(responseData.data.codigo);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST:", error);
        setHuboError(true);
        if (error.message === "Error de solicitud incorrecta (BadRequest)") {
          setCantidadError("La cantidad es incorrecta. Verifique los valores.");
        } else {
          setCantidadError("Se produjo un error al realizar la solicitud.");
        }
      });
  };

  const handleCancelar = () => {
    navigate(-1);
  };
  const eliminarProcesoProgramado = (index: number) => {
    const procesosActualizados = [...lotesCategoria.lotes];
    procesosActualizados.splice(index, 1); // Elimina el proceso programado en la posición 'index'
    setLotesCategoria({ ...lotesCategoria, lotes: procesosActualizados });
  };

  return (
    <div className="container">
      <h2>
        <div className="mb-4 row align-items-center">
          <div className="mb-2 col-12 col-md-6 col-lg-3">
            Detalle del Lote &nbsp;
          </div>
          {"  "}
          <div className="col-12 col-md-6 col-lg-3">
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggle"
              disabled={
                lotesCategoria.lotes.some(
                  (lote) => !lote.categoria.id || lote.cantidad === 0
                ) || lotesCategoria.lotes.length === 0
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
          </div>
        </div>
      </h2>
      <div className="mb-3"></div>

      <div className="detail-info row">
        <div className="col-12 col-md-6 col-lg-4 mb-3">
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
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <p>
            <span className="badge bg-secondary text-white me-2 fs-6">
              Categoría:
            </span>{" "}
            {lote.categoria?.nombre}
          </p>

          <p className="align-self-start">
            <span className="badge bg-secondary text-white me-2 fs-6">
              Cultivar:
            </span>{" "}
            {lote.cultivar?.nombre}
          </p>
          {lote.fechaDeBaja && (
            <p>
              <span className="badge bg-secondary text-white me-2 fs-6">
                Fecha de Baja:
              </span>{" "}
              {new Date(
                new Date(lote.fechaDeBaja).getTime() + 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          )}
        </div>
        <h4>
          <div className="row">
            <div className="col-6 col-md-4 col-lg-4 mt-2">
              Cambiar de Categoria:
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-primary mt-1"
                onClick={agregarProcesoProgramado}
              >
                Agregar Lote
              </button>
            </div>
          </div>
        </h4>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>
                Categoria
                <span className="invisible-text">
                  ............................
                </span>
              </th>
              <th>
                Agenda
                <span className="invisible-text">......................</span>
              </th>
              <th className="col-lg-3">
                cantidad<span className="invisible-text">.....</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lotesCategoria.lotes?.map((lote, index) => (
              <tr key={index}>
                <td className="mt-6">{index + 1}</td>
                <td>
                  <select
                    className="form-select"
                    id={`validationCustom04-${index}`}
                    required
                    value={lote.categoria.id || ""}
                    onChange={(e) => {
                      handleInputChange(index, "categoria", e.target.value);
                    }}
                  >
                    <option value="" disabled hidden></option>
                    {categorias.map((proceso) => (
                      <option key={proceso.id} value={proceso.id}>
                        {proceso.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    id={`validationCustom04-${index}`}
                    required
                    value={lote.agenda?.tipoAgenda?.id || ""}
                    onChange={(e) => {
                      handleInputChange(index, "agenda", e.target.value);
                    }}
                  >
                    <option value="" disabled hidden></option>
                    {tipoAgendas
                      .filter(
                        (agenda) => agenda.categoria.id === lote.categoria.id
                      )
                      .map((agenda) => (
                        <option key={agenda.id} value={agenda.id}>
                          {agenda.version}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    name="cantidad"
                    value={lote.cantidad}
                    onChange={(e) =>
                      handleInputChange(index, "cantidad", e.target.value)
                    }
                  />
                </td>

                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => eliminarProcesoProgramado(index)}
                    title="Eliminar"
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
                Una vez cambiado de categoria, no podrás editar el/los lote/s
                mas tarde
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
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
                onClick={handleGuardarLote}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalToggle2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {huboError ? (
                <>
                  <h5 className="modal-title text-danger">
                    Ocurrió un error &nbsp; &nbsp;
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </h5>
                </>
              ) : (
                <>
                  <h5 className="modal-title ">
                    Lote Creado Correctamente &nbsp; &nbsp;
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </h5>
                </>
              )}
            </div>
            <div className="modal-body">
              {huboError ? (
                <p>{cantidadError}</p>
              ) : (
                <>
                  <p>Los códigos de los lotes generados son:</p>
                  <ul>
                    {lotes.map((codigo, index) => (
                      <span className="badge bg-primary text-white me-2 fs-6">
                        {codigo.codigo}
                      </span>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="modal-footer">
              {huboError ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Ok
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleCancelar}
                >
                  Ok
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CambiarDeCategoria;
