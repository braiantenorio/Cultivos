import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authHeader from "../services/auth-header";
import { Categoria } from "../types/categoria";
import AutoComplete from "./AutoComplete";
import { LotesCategoria } from "../types/LotesCategoria";
import { Lote } from "../types/lote";

const EditarLote: React.FC = () => {
  const [cantidadError, setCantidadError] = useState("");
  const [cantidadError1, setCantidadError1] = useState("");
  const { loteId } = useParams();
  const [lote, setLote] = useState<Lote>({} as Lote);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [lotePadre, setLotePadre] = useState<Lote>({} as Lote);
  const [estadoLotePadre, setEstadoLotePadre] = useState("activo"); // Estado para el estado del lote padre
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
        const fecha = new Date(responseData.data.fecha);
        setLote({
          ...responseData.data,
          fecha,
        });
        const url1 = `/lotes/lotepadre/${responseData.data.codigo}`;

        fetch(url1, {
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
            setLotePadre(responseData.data || ({} as Lote));
          })
          .catch((error) => {
            console.error(error);
          });
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

    if (/^\d*$/.test(value)) {
      setCantidadError("");
      const nuevoCodigo = lote.codigo
        .split("-")
        .map((num, index) => (index === 2 ? value : num))
        .join("-");
      setLote((prevLote) => ({
        ...prevLote,
        codigo: nuevoCodigo,
      }));
    } else {
      setCantidadError("El valor debe ser un número.");
    }
  };

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const fecha = new Date(inputValue);

    if (isNaN(fecha.getTime())) {
      console.error("Fecha no válida:", inputValue);
      return;
    }

    const year = fecha.getFullYear().toString().slice(-2);

    const nuevoCodigo = lote?.codigo
      .split("-")
      .map((num, index, arr) => (index === arr.length - 1 ? year : num))
      .join("-");

    setLote((prevLote) => ({
      ...prevLote,
      fecha: fecha,
      codigo: nuevoCodigo,
    }));
  };

  const handleGuardarLote = () => {
    const lotesCategoria: LotesCategoria = {
      lotes: [lote, lotePadre], // Puedes agregar más lotes si es necesario
      estado: estadoLotePadre === "activo", // Convertimos el estado del lote padre a un booleano
    };

    const url = `/lotes`; // Ajusta la URL según sea necesario
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(lotesCategoria),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            console.log(response);
            throw new Error("Error de solicitud incorrecta (BadRequest)");
          } else {
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
          setCantidadError1("Verifique el codigo");
        } else {
          setCantidadError("Ya existe un lote con ese número de secuencia.");
        }
      });
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCantidadError1("");
    const { name, value } = event.target;
    setLotePadre((prevLote) => ({
      ...prevLote,
      [name]: value,
    }));
  };

  const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCantidadError1("");
    setEstadoLotePadre(event.target.value);
    setLotePadre((prevLote) => ({
      ...prevLote,
      codigo: "",
    }));
  };
  const handleOptionSelect = (option: string) => {
    setCantidadError1("");
    setLotePadre((prevLote) => ({
      ...prevLote,
      codigo: option,
    }));
  };

  const tercerNumeroSecuencia = (lote.codigo || "").split("-")[2] || "";

  return (
    <div className="container">
      <h1>Editar Lote</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="codigoL" className="form-label">
            Código:
          </label>
          <input
            type="text"
            className="form-control"
            id="codigoL"
            name="codigoL"
            value={lote?.codigo || ""} // Usa una cadena vacía si lote.codigo es undefined
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

        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="cultivarId" className="form-label">
              Cultivar:
            </label>
            <input
              className="form-select"
              id="cultivarId"
              name="cultivarId"
              value={lote.cultivar?.nombre + " (" + lote.cultivar?.codigo + ")"}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="categoriaId" className="form-label">
              Categoría:
            </label>
            <input
              className="form-select"
              id="categoriaId"
              name="categoriaId"
              value={
                lote.categoria?.nombre + " (" + lote.categoria?.codigo + ")"
              }
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="numeroSecuencia" className="form-label">
              Número de Secuencia:
            </label>
            <input
              type="text"
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

          <div className="col-md-3 mb-3">
            <label htmlFor="fecha" className="form-label">
              Fecha de Creación:
            </label>
            <input
              type="date"
              className="form-control"
              id="fecha"
              name="fecha"
              value={lote.fecha?.toISOString().split("T")[0]}
              onChange={handleFechaChange}
            />
          </div>
        </div>

        <div className="mb-3 col-12">
          <label htmlFor="codigoPadre" className="form-label">
            Código del Lote Padre:
          </label>
          <div className="d-flex align-items-center col-3">
            <input
              type="text"
              className="form-control me-2"
              id="codigoPadre"
              name="codigoPadre"
              value={lotePadre.codigo}
              readOnly
            />

            <button
              type="button"
              className="btn btn-primary me-2 "
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggle"
            >
              <i className="bi bi-pen"></i>
            </button>
          </div>
          {cantidadError1 && (
            <div className="alert alert-danger">{cantidadError1}</div>
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

      {/* Modal */}

      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Código del Lote Padre</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="estadoLotePadre" className="form-label">
                    Estado del Lote:
                  </label>
                  <select
                    id="estadoLotePadre"
                    className="form-select"
                    value={estadoLotePadre}
                    onChange={handleEstadoChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="codigoPadreM" className="form-label">
                    Código:
                  </label>
                  <div>
                    {estadoLotePadre === "activo" ? (
                      <AutoComplete
                        onOptionSelect={handleOptionSelect}
                        descripcion="Buscar lote por codigo, categoria o cultivar"
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        name="codigo"
                        value={lotePadre.codigo}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarLote;
