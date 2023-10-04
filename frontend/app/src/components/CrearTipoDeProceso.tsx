import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Atributo } from "../types/atributo";

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

  const navigate = useNavigate();

  useEffect(() => {
    const url = "/atributos";
    fetch(url)
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
    setListaDeAtributos({
      ...listaDeAtributos,
      atributos: [
        ...listaDeAtributos.atributos,
        atributosSelect.find(
          (atributo) => atributo.id === parseInt(atributoId)
        )!,
      ],
    });
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    fetch(`/listaDeAtributos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
              Choose...
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

        <div className="">
          <ul className="list-group list-group-flush">
            {listaDeAtributos.atributos.map((atributo) => (
              <li key={atributo.id} className="list-group-item">
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
          <button className="btn btn-primary" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
export default CrearTipoDeProceso;
