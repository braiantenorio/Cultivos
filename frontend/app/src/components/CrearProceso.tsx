import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Atributo } from "../types/atributo";
import { Proceso } from "../types/proceso";
import { Valor } from "../types/valor";
import { TipoDeProceso } from "../types/tipoDeProceso";
import { useNotifications } from "../Menu";
import { LoteCodigo } from "../types/loteCodigo";
import authHeader from "../services/auth-header";

function CrearProceso() {
  const { listId } = useParams();
  const { loteId } = useParams();
  const [valores, setValores] = useState<Valor[]>([]);
  const [tipoDeProceso, setTipoDeProceso] = useState<TipoDeProceso>(
    {} as TipoDeProceso
  ); // aca falta asignar hay que arreglar
  const [tiposDeProcesos, setTiposDeProcesos] = useState<TipoDeProceso[]>([]);
  const [selectsHabilitados, setSelectsHabilitados] = useState(false);
  const { notifications, updateNotifications } = useNotifications();
  const { notificationMessages } = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    if (listId !== "new") {
      fetch(`/listaDeAtributos/nombre/${listId}`, {
        headers: authHeader(),
      })
        .then((response) => response.json())
        .then((data) => {
          setTipoDeProceso(data.data);
          const valoresData: Valor[] = data.data.atributos.map(
            (atributo: Atributo) => ({
              id: null,
              atributo: atributo,
              valor: null,
              imagen: null, //nuevo xd
            })
          );

          setValores(valoresData);
          setSelectsHabilitados(true);
          console.log(valores);
        })
        .catch((error) => console.error("Error fetching attributes:", error));
    }
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
        setTiposDeProcesos(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAgregarValor = (
    event: React.ChangeEvent<HTMLInputElement>,
    nombreAtributo: string
  ) => {
    const { value } = event.target;
    setValores(
      valores.map((valor) => {
        if (valor.atributo.nombre === nombreAtributo) {
          return { ...valor, valor: value };
        } else {
          return valor;
        }
      })
    );
  };

  const handleAgregarImagen = (
    event: React.ChangeEvent<HTMLInputElement>,
    nombreAtributo: string
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]; // Obtener el archivo de imagen
      setValores((prevValores) => {
        return prevValores.map((valor) => {
          if (valor.atributo.nombre === nombreAtributo) {
            return { ...valor, imagen: file };
          } else {
            return valor;
          }
        });
      });
    }
  };

  const handleTiposDeProcesosChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    const selectedCategoria = tiposDeProcesos.find(
      (categoria) => categoria.id === parseInt(value, 10)
    );
    setTipoDeProceso(selectedCategoria || ({} as TipoDeProceso));

    setValores(
      selectedCategoria?.atributos.map((atributo: Atributo) => ({
        id: null,
        atributo: atributo,
        valor: null,
        imagen: null,
      })) || []
    );
  };

  const renderizarInput = (atributo: Atributo, index: number) => {
    switch (atributo.tipo) {
      case "string":
        return (
          <input
            id={atributo.id.toString()}
            className="form-control"
            type="text"
            name={atributo.nombre}
            //value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            maxLength={atributo.caracteres}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      case "number":
        return (
          <input
            className="form-control"
            id={atributo.id.toString()}
            type="number"
            name={atributo.nombre}
            //value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            min={atributo.minimo}
            max={atributo.maximo}
            step={1 / Math.pow(10, atributo.decimales || 0)}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      case "fecha":
        return (
          <input
            className="form-control"
            id={atributo.id.toString()}
            type="date"
            name={atributo.nombre}
            //value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      case "imagen":
        return (
          <input
            id={atributo.id.toString()}
            className="form-control"
            type="file"
            accept="image/*"
            name={atributo.nombre}
            required={atributo.obligatorio}
            onChange={(event) => handleAgregarImagen(event, atributo.nombre)}
          />
        );
      default:
        return <input className="form-control" key={atributo.id} type="text" />;
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const uploadPromises: Promise<void>[] = [];

    valores.forEach((valor) => {
      if (valor.imagen) {
        const formData = new FormData();
        formData.append("file", valor.imagen);
        const uploadPromise = axios
          .post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: authHeader().Authorization,
            },
          })
          .then((response) => {
            console.log("File upload response:", response.data);
            valor.imagen = null;
            valor.valor = response.data.data.id;
            console.log(valores);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });

        uploadPromises.push(uploadPromise);
      }
    });

    // Espera a que todas las promesas de carga se completen antes de continuar
    await Promise.all(uploadPromises);

    const nProceso: Proceso = {
      id: 0,
      usuario: null,
      fecha: null,
      valores: valores,
      listaDeAtributos: tipoDeProceso,
      deleted: false,
    };

    if (notificationMessages.length > 0) {
      const nLoteCodigo: LoteCodigo = {
        lotesCodigos: notificationMessages,
        proceso: nProceso,
      };

      fetch(`/procesos/lotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader().Authorization,
        },
        body: JSON.stringify(nLoteCodigo),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
        })
        .catch((error) => {
          console.error("Error al crear el proceso:", error);
        });
    } else {
      fetch(`/procesos/lote/${loteId}?indep=${!selectsHabilitados}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader().Authorization,
        },
        body: JSON.stringify(nProceso),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
        })
        .catch((error) => {
          console.error("Error al crear el proceso:", error);
        });
    }
    updateNotifications(notifications, []);
    navigate(-1);
  };
  const handleCancelar = () => {
    updateNotifications(notifications, []);
    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Registrar Proceso </h2>
      <div className="col-md-6">
        {notificationMessages.length > 0 ? (
          <ul className="list-inline">
            <label htmlFor="proceso" className="form-label">
              Lotes:
            </label>
            &nbsp;&nbsp;
            {notificationMessages.map((str, index) => (
              <li key={index} className="list-inline-item">
                <span className="badge badge-custom-1 text-white me-2 fs-6">
                  {str}
                </span>{" "}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="list-inline">
            <label htmlFor="proceso" className="form-label">
              Lote:
            </label>
            &nbsp;&nbsp;
            <span className="badge badge-custom-1 text-white me-2 fs-6">
              {loteId}
            </span>{" "}
          </ul>
        )}
        <label htmlFor="proceso" className="form-label">
          Tipo de Proceso
        </label>
        <select
          className="form-select"
          id="proceso"
          name="proceso"
          value={tipoDeProceso.id}
          onChange={handleTiposDeProcesosChange}
          disabled={selectsHabilitados}
        >
          <option value="">Selecciona el tipo de proceso...</option>
          {tiposDeProcesos.map((proceso) => (
            <option key={proceso.id} value={proceso.id}>
              {proceso.nombre}
            </option>
          ))}
        </select>
      </div>
      <ul></ul>
      {tipoDeProceso && (
        <form className="row g-3" onSubmit={handleSubmit}>
          {tipoDeProceso.atributos?.map((atributo, index) => (
            <div className="col-md-7" key={atributo.id}>
              <label htmlFor={atributo.id.toString()} className="form-label">
                {atributo.nombre}
              </label>
              {renderizarInput(atributo, index)}
            </div>
          ))}
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggle"
              disabled={tipoDeProceso.atributos == null}
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
                    Una vez registrado, no podrás editar este proceso más tarde.
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
                    type="submit"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default CrearProceso;
