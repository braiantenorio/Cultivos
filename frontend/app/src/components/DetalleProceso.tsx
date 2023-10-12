import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lote } from "../types/lote";
import { Proceso } from "../types/proceso";
import swal from "sweetalert";
import authHeader from "../services/auth-header";

function DetalleProceso() {
    const { procesoId } = useParams();
    const [proceso, setProceso] = useState<Proceso | null>(null);
    const navigate = useNavigate();

    const url = `/procesos/id/${procesoId}`;
    useEffect(() => {
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
                setProceso(responseData.data);
                console.log(proceso);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

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
                <dd className="col-sm-9">{proceso.usuario? proceso.usuario : 'prueba'} </dd>

                <dt className="col-sm-3">Fecha</dt>
                <dd className="col-sm-9">{proceso.fecha?.toLocaleString('en-US')}</dd>

                <dt className="col-sm-3">Tipo</dt>
                <dd className="col-sm-9">{proceso.usuario? proceso.usuario : 'aca va el tipo del proceso'} </dd>

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
                            <td>{valor.valor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DetalleProceso;
