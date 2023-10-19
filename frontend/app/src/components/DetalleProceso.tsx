import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";
import axios from "axios";

function DetalleProceso() {
    const { procesoId } = useParams();
    const [proceso, setProceso] = useState<Proceso | null>(null);
    const [fileLinks, setFileLinks] = useState<(JSX.Element | null)[]>([]); // State to store file links

    useEffect(() => {
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
                    console.log(fileInfo)
                    return (
                        <a key={valor.id} href={"http://localhost:8080/files/view/" + valor.valor} target="_blank" rel="noreferrer">
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

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Detalle del proceso</h2>
            </div>
            <dl className="row">
                <dt className="col-sm-3">Usuario</dt>
                <dd className="col-sm-9">{proceso.usuario?.nombre} {proceso.usuario?.apellido} </dd>

                <dt className="col-sm-3">Fecha</dt>
                <dd className="col-sm-9">{proceso.fecha?.toLocaleString('en-US')}</dd>

                <dt className="col-sm-3">Tipo</dt>
                <dd className="col-sm-9">{proceso.listaDeAtributos?.nombre} </dd>

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
                        <td>{valor.atributo.tipo === "imagen" ? fileLinks[index] : valor.valor}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    );
}

export default DetalleProceso;
