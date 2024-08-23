import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";
import axios from "axios";
import Usuario from "../types/usuario";
import * as AuthService from "../services/auth.service";

function DetalleProceso() {
  const { procesoId } = useParams();
  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [procesoD, setProcesoD] = useState<Proceso | null>(null);
  const [fileLinks, setFileLinks] = useState<(JSX.Element | null)[]>([]); // State to store file links
  const navigate = useNavigate();
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Usuario | undefined>(
    undefined
  );

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    fetch(`/procesos/id/${procesoId}`, {
      headers: authHeader(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setProceso(responseData.data);
        if (responseData.data.deleted) {
          console.log("dsda");
          fetch(`/procesos/audit/${procesoId}`, {
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
              setProcesoD(responseData.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (proceso) {
      const fileLinkPromises = proceso.valores.map(async (valor, index) => {
        if (valor.atributo.tipo === "imagen") {
          const response = await axios.get(`/files/info/${valor.valor}`);
          const fileInfo = response.data;
          console.log(fileInfo);
          return (
            <a
              key={valor.id}
              href={
                process.env.REACT_APP_API_URL + "/files/view/" + valor.valor
              }
              target="_blank"
              rel="noreferrer"
            >
              {fileInfo.name}
            </a>
          );
        }
        return null;
      });
      Promise.all(fileLinkPromises).then((links) => setFileLinks(links));
    }
  }, [proceso]);

  if (!proceso) {
    return <div>Cargando...</div>;
  }
  const handleAnular = () => {
    swal({
      title: "¿Estás seguro?",
      text: "Una vez anulado, no podrás recuperar este lote.",
      icon: "warning",
      buttons: ["Cancelar", "Anular"],
      dangerMode: true,
    }).then((willAnular) => {
      if (willAnular) {
        fetch(`/procesos/delete/${procesoId}`, {
          method: "DELETE",
          headers: authHeader(),
        })
          .then((response) => {
            if (response.ok) {
              // Si la respuesta es exitosa, puedes realizar acciones adicionales aquí
              swal("El lote ha sido anulado.", {
                icon: "success",
              });
              navigate(-1);
            } else {
              // Si la respuesta no es exitosa, maneja el error aquí
              console.error("Error al anular el lote");
            }
          })
          .catch((error) => {
            // Maneja cualquier error que ocurra durante la solicitud HTTP
            console.error("Error al anular el lote", error);
          });
      }
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalle del proceso</h2>
        <div className="col-4 col-md-6 col-lg-4  ms-5">
          <button className="btn btn-danger " onClick={() => navigate(-1)}>
            Atrás <i className="bi bi-arrow-left"></i>
          </button>
        </div>
        {(showModeratorBoard || showAdminBoard) && !proceso.deleted ? (
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
                  className="dropdown-item dropdown-item-danger d-flex gap-2 align-items-center"
                  onClick={handleAnular}
                >
                  Anular
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>

      <dl className="row">
        <dt className="col-sm-3">Usuario</dt>
        <dd className="col-sm-9">
          {proceso.usuario?.nombre} {proceso.usuario?.apellido}{" "}
        </dd>

        <dt className="col-sm-3">Fecha</dt>
        <dd className="col-sm-9">{proceso.fecha?.toLocaleString("en-US")}</dd>

        <dt className="col-sm-3">Tipo</dt>
        <dd className="col-sm-9">{proceso.listaDeAtributos?.nombre} </dd>
        {proceso.deleted && (
          <>
            <dt className="col-sm-3">Fecha de Baja:</dt>
            <dd className="col-sm-9">
              {procesoD?.fecha?.toLocaleString("en-US")}
            </dd>

            <dt className="col-sm-3">Anulado Por:</dt>
            <dd className="col-sm-9">
              {procesoD?.usuario?.nombre} {procesoD?.usuario?.apellido}
            </dd>
          </>
        )}
      </dl>

      <h3>Atributos</h3>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {proceso.valores.map((valor, index) => (
            <tr key={valor.id}>
              <td>{index + 1}</td>
              <td>{valor.atributo.nombre}</td>
              <td>
                {valor.atributo.tipo === "imagen"
                  ? fileLinks[index]
                  : valor.valor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleProceso;
