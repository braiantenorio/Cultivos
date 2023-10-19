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
  const [showModal, setShowModal] = useState(false);
  const [codigoLoteGenerado, setCodigoLoteGenerado] = useState("");
  const [selectsHabilitados, setSelectsHabilitados] = useState({
    cultivar: true,
    // lotePadre: true,
  });

  useEffect(() => {
    const url = "/categorias";
    const url1 = "/cultivares";

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
      cultivar: selectedCategoria || { id: 0, nombre: "", codigo: 0 },
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
      cultivar: selectdlote?.cultivar || { id: 0, nombre: "", codigo: 0 },
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
        setShowModal(true);
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
  const closeModal = () => {
    setShowModal(false);
    navigate("/lotes");
  };

  return (
    <div className="container">
      <h1>Crear Nuevo Lote</h1>
      <form>
        <div className="mb-3 row align-items-center">
          <div className="col-3">
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
          &nbsp; &nbsp;
          {tipoAgendas.length > 0 && (
            <div className="col-3">
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
            </div>
          )}
        </div>
        <div className="mb-3 col-5">
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
                {categoria.codigo} ({categoria.categoria.nombre})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 col-5">
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
        <div className="mb-3 col-5">
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
        &nbsp;
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleGuardarLote}
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
        className="modal fade show overlay"
        tabIndex={-1}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Código del Lote Generado</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
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
                onClick={closeModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearLote;
