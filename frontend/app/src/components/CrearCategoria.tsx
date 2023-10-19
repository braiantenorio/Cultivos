import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Categoria } from "../types/categoria";
import authHeader from "../services/auth-header";

function CrearCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tipo, setTipo] = useState("Crear Categoria");

  const [cantidadError, setCantidadError] = useState("");
  const [categoria, setCategoria] = useState({
    id: 0,
    nombre: "",
    codigo: "",
    subCategorias: [] as Categoria[],
    limite: true,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [atributoId, setAtributoId] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const url = "/categorias";

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
        console.log(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
    if (id != "new") {
      setTipo("Editar Categoria");
      fetch(`/categorias/id/${id}`, {
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
          setCategoria(responseData.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleAtributosChange = () => {
    const selectedAtributo = categorias.find(
      (atributo) => atributo.id === parseInt(atributoId)
    )!;
    if (!categoria.subCategorias.some((a) => a.id === selectedAtributo.id)) {
      setCategoria({
        ...categoria,
        subCategorias: [...categoria.subCategorias, selectedAtributo],
      });
    } else {
      setShowAlert(true);
    }
  };
  const guardarCategoria = () => {
    console.log(categoria);
    fetch(`/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(categoria),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error de solicitud incorrecta ");
        }

        response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al crear la categoria:", error);
      });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setCategoria((prevLote) => ({
      ...prevLote,
      [name]: value,
    }));
  };

  function onDelete(id: number) {
    setCategoria({
      ...categoria,
      subCategorias: categoria.subCategorias.filter((a) => a.id !== id),
    });
  }
  const handleCancelar = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <form>
        <h2>
          {tipo} &nbsp;&nbsp; &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-success"
            onClick={guardarCategoria}
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
        </h2>

        <div className="mb-3 col-5">
          <label htmlFor="categoria" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={categoria.nombre}
            onChange={handleInputChange}
            required
            disabled={id != "new"}
          />
        </div>
        <div className="mb-3 col-5">
          <label htmlFor="fechaInicio" className="form-label">
            Codigo:
          </label>
          <input
            type="text"
            className="form-control"
            id="codigo"
            name="codigo"
            value={categoria.codigo}
            onChange={handleInputChange}
            disabled={id != "new"}
          />
          {cantidadError && (
            <div className="alert alert-danger">{cantidadError}</div>
          )}
        </div>
        <div className="mb-3 col-5">
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Limite:
          </label>
          &nbsp;&nbsp;
          <input
            className="form-check-input"
            type="checkbox"
            checked={categoria.limite}
            onChange={(e) =>
              setCategoria({ ...categoria, limite: e.target.checked })
            }
            id="flexCheckDefault"
            disabled={id != "new"}
            style={{ transform: "scale(1.5)" }} // Aumenta el tamaño del checkbox
          />
        </div>

        <div className="col-md-5 d-flex align-items-center">
          {" "}
          <label htmlFor="validationCustom04" className="form-label">
            Subcategorias:
          </label>
          &nbsp;&nbsp; &nbsp;
          <select
            className="form-select ms-2"
            id="validationCustom04"
            required
            value={atributoId}
            onChange={(e) => setAtributoId(e.target.value)}
          >
            <option value="" disabled hidden>
              Choose...
            </option>
            {categorias.map((atributo) => (
              <option key={atributo.id} value={atributo.id}>
                {atributo.nombre}
              </option>
            ))}
          </select>
          &nbsp;&nbsp;
          <button
            type="button"
            disabled={atributoId === ""}
            className="btn btn-primary ms-2"
            onClick={handleAtributosChange}
          >
            Agregar
          </button>
        </div>
      </form>

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
      <ul></ul>
      <div className="">
        <ul className="list-group list-group-flush">
          {categoria.subCategorias?.map((atributo) => (
            <li
              key={atributo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {atributo.nombre}
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => onDelete(atributo?.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CrearCategoria;
