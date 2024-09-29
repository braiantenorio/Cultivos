import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Atributo } from "../types/atributo";
import authHeader from "../services/auth-header";

function CrearAtributo() {
  const [atributo, setAtributo] = useState<Atributo>({
    id: 0,
    nombre: "",
    tipo: "",
    obligatorio: false,
    caracteres: 50, // Valor predeterminado de 50 caracteres
    minimo: 0,
    maximo: 100,
    decimales: 0,
    deleted: false,
  });

  const navigate = useNavigate();

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAtributo({
      ...atributo,
      nombre: e.target.value,
    });
  }
  function handleTipoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAtributo({
      ...atributo,
      tipo: e.target.value,
    });
  }
  function handleObligatorioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAtributo({
      ...atributo,
      obligatorio: e.target.checked,
    });
  }
  function handleLimiteCaracteresChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setAtributo({
      ...atributo,
      caracteres: e.target.valueAsNumber,
    });
  }
  function handleRangoMinimoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAtributo({
      ...atributo,
      minimo: e.target.valueAsNumber,
    });
  }

  function handleRangoMaximoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAtributo({
      ...atributo,
      maximo: e.target.valueAsNumber,
    });
  }

  function handleLimiteDecimalesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAtributo({
      ...atributo,
      decimales: e.target.valueAsNumber,
    });
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    fetch(`/atributos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(atributo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => {
        console.error("Error al crear el proceso:", error);
      });
    navigate("/atributos");
  };

  return (
    <div className="container">
      <h2>Nuevo atributo</h2>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="validationCustom01" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom01"
            value={atributo.nombre}
            onChange={handleNombreChange}
            required
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="validationCustom04" className="form-label">
            Tipo
          </label>
          <select
            className="form-select"
            id="validationCustom04"
            required
            value={atributo.tipo}
            onChange={handleTipoChange}
          >
            <option value="" disabled selected hidden>
              Seleccionar...
            </option>
            <option value="string">Texto</option>
            <option value="number">Numérico</option>
            <option value="fecha">Fecha</option>
            <option value="imagen">Imagen</option>
          </select>
        </div>
        <div className="col-md-2" hidden={atributo.tipo !== "number"}>
          <label htmlFor="validationCustomUsername" className="form-label">
            Rango minimo
          </label>
          <input
            type="number"
            className="form-control"
            id="validationCustomUsername"
            value={atributo.minimo}
            onChange={handleRangoMinimoChange}
          />
        </div>
        <div className="col-md-2" hidden={atributo.tipo !== "string"}>
          <label htmlFor="validationCustom02" className="form-label">
            Limite de carateres
          </label>
          <input
            type="number"
            className="form-control"
            id="validationCustom02"
            value={atributo.caracteres}
            onChange={handleLimiteCaracteresChange}
          />
        </div>
        <div className="col-md-2" hidden={atributo.tipo !== "number"}>
          <label htmlFor="validationCustom03" className="form-label">
            Rango maximo
          </label>
          <input
            type="number"
            className="form-control"
            id="validationCustom03"
            value={atributo.maximo}
            onChange={handleRangoMaximoChange}
          />
        </div>
        <div className="col-md-2" hidden={atributo.tipo !== "number"}>
          <label htmlFor="validationCustom05" className="form-label">
            Limite de decimales
          </label>
          <input
            type="number"
            className="form-control"
            id="validationCustom05"
            value={atributo.decimales}
            onChange={handleLimiteDecimalesChange}
          />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={atributo.obligatorio}
              id="invalidCheck"
              onChange={handleObligatorioChange}
            />
            <label className="form-check-label" htmlFor="invalidCheck">
              Obligatorio
            </label>
          </div>
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
                  Una vez creado, no podrás editar este atributo más tarde.
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

export default CrearAtributo;
