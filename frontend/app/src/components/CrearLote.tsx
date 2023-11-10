import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/categoria";
import { Lote } from "../types/lote";
import { Cultivar } from "../types/cultivar";
import { useNotifications } from "../Menu";
import { TipoAgenda } from "../types/tipoAgenda";
import { Agenda } from "../types/agenda";
import authHeader from "../services/auth-header";

const CrearLote: React.FC = () => {
  const [cantidadError, setCantidadError] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [nuevoLote, setNuevoLote] = useState<Lote>({} as Lote);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const navigate = useNavigate();
  const { notifications, updateNotifications } = useNotifications();
  const [tipoAgendas, setTipoAgendas] = useState<TipoAgenda[]>([]);
  const [codigoLoteGenerado, setCodigoLoteGenerado] = useState("");
  const [selectsHabilitados, setSelectsHabilitados] = useState({
    cultivar: true,
    // lotePadre: true,
  });

  useEffect(() => {
    const url = "/categorias/search";
    const url1 = "/cultivares/search";

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
    fetch(url1, {
      headers: authHeader(),
    })
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
      fetch(`/lotes/activos/${categoria.id}`, {
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
          setLotes(responseData.data);
        })
        .catch((error) => {
          console.error(error);
        });
      fetch(`/tipoagendas/${categoria.nombre}`, {
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
          setTipoAgendas(responseData.data);
          const agenda: Agenda = {
            id: 0,
            procesosProgramado: [],
            tipoAgenda: responseData.data[0],
          };

          setNuevoLote((prevLote) => ({
            ...prevLote,
            agenda: agenda,
          }));
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
      categoria: selectedCategoria || {
        id: 0,
        nombre: "",
        codigo: 0,
        subCategorias: [],
        limite: false,
        deleted: false,
      },
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
      cultivar: selectedCategoria || {
        id: 0,
        nombre: "",
        codigo: 0,
        deleted: false,
      },
    }));
  };
  const handleAgendaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedCategoria = tipoAgendas.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );
    const agenda: Agenda = {
      id: 0,
      procesosProgramado: [],
      tipoAgenda: selectedCategoria!,
    };

    setNuevoLote((prevLote) => ({
      ...prevLote,
      agenda: agenda,
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
      cultivar: selectdlote?.cultivar || {
        id: 0,
        nombre: "",
        codigo: 0,
        deleted: false,
      },
    }));
  };

  const handleGuardarLote = () => {
    const url = "/lotes";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(nuevoLote),
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
        console.log("Respuesta del servidor:", responseData);
        // Obtiene la fecha actual en formato ISO (yyyy-mm-dd)
        const today = new Date().toISOString().split("T")[0];

        // Filtra los procesos programados con fecha igual a la de hoy
        const procesosHoy = responseData.data.agenda.procesosProgramado.filter(
          (proceso: { fechaARealizar: string }) =>
            proceso.fechaARealizar === today
        );
        updateNotifications(notifications + procesosHoy.length, []);
        setCodigoLoteGenerado(responseData.data.codigo);
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
    navigate(-1);
  };
  const handleCancelar1 = () => {
    navigate("/lotes?pagina=1&longitud=7");
  };

  return (
    <div className="container">
      <h1>Crear Nuevo Lote</h1>
      <form>
        <div className="mb-3 row align-items-center">
          <div className="col-12 col-md-6 col-lg-3">
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
                  {categoria.nombre}&nbsp;({categoria.codigo})
                </option>
              ))}
            </select>
          </div>
          &nbsp;
          <div className="col-12 col-md-6 col-lg-3">
            {tipoAgendas.length > 0 && (
              <>
                <label htmlFor="agenda" className="form-label">
                  Agenda version:
                </label>
                <select
                  className="form-select"
                  id="agenda"
                  name="agenda"
                  value={nuevoLote.agenda?.tipoAgenda.id}
                  onChange={handleAgendaChange}
                >
                  {tipoAgendas.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.version}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        <div className="mb-3 col-12 col-lg-5">
          <label htmlFor="cultivar" className="form-label">
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
                {categoria.nombre}&nbsp; ({categoria.codigo})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-12 col-lg-5">
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
          <button
            type="button"
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalToggle"
            disabled={
              nuevoLote.codigo === "" ||
              nuevoLote.cantidad < 1 ||
              nuevoLote.cantidad == null ||
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
                Una vez creado, no podrás editar este lote más tarde.
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
              <h5 className="modal-title ">
                Lote Creado Correctamente &nbsp; &nbsp;
                <i
                  className="bi bi-check-circle-fill text-success "
                  style={{ fontSize: "2rem" }}
                ></i>
              </h5>
            </div>
            <div className="modal-body">
              <p>
                El código del lote generado es:{" "}
                <span className="badge bg-primary text-white me-2 fs-6">
                  {codigoLoteGenerado}
                </span>
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleCancelar1}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearLote;
