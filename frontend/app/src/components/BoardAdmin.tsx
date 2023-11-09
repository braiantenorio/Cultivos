import React, { useState, useEffect } from "react";

import { getAdminBoard, getUsers, changeRole } from "../services/user.service";
import EventBus from "../common/EventBus";
import Usuario from "../types/usuario";

const BoardAdmin: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selecteRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        // Manejar errores si es necesario
      });
  }, []);

  const handleModal = (user: Usuario) => {
    setSelectedUser(user);
    setSelectedRole(getHighestRole(user)!.name);
    console.log(getHighestRole(user));
  };

  const submitChange = () => {
    changeRole(selectedUser?.id, selecteRole);
    window.location.reload();
  };

  const getHighestRole = (user: Usuario) => {
    let highestRole = null;

    const roleOrder = ["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER"];

    for (const roleName of roleOrder) {
      const role = user.roles!.find((userRole) => userRole.name === roleName);
      if (role) {
        highestRole = role;
        break;
      }
    }

    return highestRole;
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
      <h4>Usuarios</h4>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>

          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.email}</td>
              <td>{getHighestRole(user)!.name === "ROLE_ADMIN" ? (
                // Mostrar contenido específico para ROLE_ADMIN
                <div>Administrador</div>
              ) : getHighestRole(user)!.name === "ROLE_MODERATOR" ? (
                // Mostrar contenido específico para ROLE_MODERATOR
                <div>Moderador</div>
              ) : (
                // Mostrar contenido predeterminado para otros roles
                <div>Usuario</div>
              )}</td>
              <td>
                <div className="dropdown" style={{ position: "static" }}>
                  <button
                    className="d-flex align-items-center link-body-emphasis text-decoration-none"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      position: "static",
                      padding: 0,
                      border: "none",
                      background: "none",
                    }}
                  >
                    <i className="bi bi-three-dots"></i>
                  </button>
                  <ul
                    className="dropdown-menu text-small shadow "
                    data-boundary="viewport"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => handleModal(user)}
                      >
                        Modificar rol
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modificar rol
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <dl className="row">
                  <dt className="col-sm-3">Nombre</dt>
                  <dd className="col-sm-9">{selectedUser?.nombre}</dd>

                  <dt className="col-sm-3">Apellido</dt>
                  <dd className="col-sm-9">{selectedUser?.apellido}</dd>

                  <dt className="col-sm-3">Email</dt>
                  <dd className="col-sm-9">{selectedUser?.email}</dd>
                </dl>

                <div className="input-group mb-3">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    Seleccionar rol
                  </label>
                  <select
                    className="form-select"
                    id="inputGroupSelect01"
                    value={selecteRole!}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="ROLE_USER">Usuario</option>
                    <option value="ROLE_MODERATOR">Moderador</option>
                    <option value="ROLE_ADMIN">Administrador</option>
                  </select>
                </div>
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
                  type="submit"
                  onClick={() => submitChange()}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </table>
    </div>
  );
};

export default BoardAdmin;
