import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Categoria } from "../types/categoria";
import authHeader from "../services/auth-header";
import Usuario from "../types/usuario";
import * as AuthService from "../services/auth.service";

function CrearCategoria() {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );
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
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
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
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST:", error);

        if (error.message === "Error de solicitud incorrecta (BadRequest)") {
          setCantidadError(
            "Ya existe categoria con este codigo. Verifique los valores."
          );
        } else {
          setCantidadError(
            "Ya existe categoria con este codigo. Verifique los valores."
          );
        }
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
        <div className="mb-3 col-12 col-lg-5">
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
        <div className="mb-3 col-12 col-lg-5">
          <label htmlFor="fechaInicio" className="form-label">
            Codigo:
          </label>
          <input
            type="text"
            className="form-control mb-4"
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
        <div className="mb-4 col-12">
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Lleva control en la cantidad del lote :
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

        <div className="col-md-7 d-flex flex-column flex-md-row align-items-md-center">
          <label htmlFor="validationCustom04" className="form-label col-md-3  ">
            Se puede Transformar en las categorias:
          </label>
          {showModeratorBoard && (
            <div className="row">
              <div className="mt-2 mt-md-0 ms-md-2 col-8 col-md-8">
                <select
                  className="form-select"
                  id="validationCustom04"
                  required
                  value={atributoId}
                  onChange={(e) => setAtributoId(e.target.value)}
                >
                  <option value="" disabled hidden></option>
                  {categorias.map((atributo) => (
                    <option key={atributo.id} value={atributo.id}>
                      {atributo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 mt-md-0 ms-md-2 col-4 col-md-2">
                <button
                  type="button"
                  disabled={atributoId === ""}
                  className="btn btn-primary"
                  onClick={handleAtributosChange}
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
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
                ¡Advertencia!
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
                data-bs-dismiss="modal"
                onClick={guardarCategoria}
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

export default CrearCategoria;
