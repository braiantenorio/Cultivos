import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Atributo } from "../types/atributo";
import authHeader from "../services/auth-header";

function CrearTipoDeProceso() {
  const [listaDeAtributos, setListaDeAtributos] = useState({
    id: 0,
    nombre: "",
    atributos: [] as Atributo[],
  });

  const [atributoId, setAtributoId] = useState<string>("");
  const [atributosSelect, setAtributos] = useState<Atributo[]>(
    [] as Atributo[]
  );
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const url = "/atributos/search";
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
        setAtributos(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    setListaDeAtributos({
      ...listaDeAtributos,
      nombre: e.target.value,
    });
  }

  function handleAtributosChange() {
    const selectedAtributo = atributosSelect.find(
      (atributo) => atributo.id === parseInt(atributoId)
    )!;

    if (!listaDeAtributos.atributos.some((a) => a.id === selectedAtributo.id)) {
      setListaDeAtributos({
        ...listaDeAtributos,
        atributos: [...listaDeAtributos.atributos, selectedAtributo],
      });
    } else {
      setShowAlert(true);
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    fetch(`/listaDeAtributos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(listaDeAtributos),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => {
        console.error("Error al crear el proceso:", error);
      });
    navigate(-1);
  };

  function onDelete(id: number) {
    setListaDeAtributos({
      ...listaDeAtributos,
      atributos: listaDeAtributos.atributos.filter((a) => a.id !== id),
    });
  }

  return (
    <div className="container">
      <h2>Nuevo tipo de proceso</h2>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="validationCustom01" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom01"
            value={listaDeAtributos.nombre}
            onChange={handleNombreChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom04" className="form-label">
            Atributos
          </label>
          <select
            className="form-select"
            id="validationCustom04"
            required
            value={atributoId}
            onChange={(e) => setAtributoId(e.target.value)}
          >
            <option value="" disabled hidden>
              Seleccionar...
            </option>
            {atributosSelect.map((atributo) => (
              <option key={atributo.id} value={atributo.id}>
                {atributo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 align-self-end">
          <button
            type="button"
            disabled={atributoId === ""}
            className="btn btn-secondary"
            onClick={handleAtributosChange}
          >
            Agregar
          </button>
        </div>

        {/* Alerta Bootstrap */}
        {showAlert && (
          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>¡Advertencia!</strong> Este atributo ya está en la lista.
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="">
          <ul className="list-group list-group-flush">
            {listaDeAtributos.atributos.map((atributo) => (
              <li
                key={atributo.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {atributo.nombre}
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => onDelete(atributo.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12">
          <button
            type="button"
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalToggle"
          >
            Guardar
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
                  Una vez creado, no podrás editar este tipo de proceso más
                  tarde.
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
    </div>
  );
}
export default CrearTipoDeProceso;
