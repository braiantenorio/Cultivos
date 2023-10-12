import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import { TipoDeProceso } from "../types/tipoDeProceso";
import authHeader from "../services/auth-header";

function ListarTiposDeProcesos() {
  const [tipoDeProceso, setTipoDeProceso] = useState<TipoDeProceso[]>([]);

  useEffect(() => {
    const url = "/listaDeAtributos";

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
        setTipoDeProceso(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container">
      <h2>Tipos de Procesos </h2>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
						<th>Atributos</th>

          </tr>
        </thead>
        <tbody>
          {tipoDeProceso.map((tipoAgenda, index) => (
            <tr key={tipoAgenda.id}>
              <td>{index + 1}</td>
              <td>{tipoAgenda.nombre}</td>
              <td colSpan={4}>
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Obligatorio</th>
                      <th>Decimales</th>
                      <th>Caracteres</th>
                      <th>Maximo</th>
                      <th>Minimo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipoAgenda.atributos.map((tipoAgenda, index) => (
                      <tr key={tipoAgenda.id}>
                        <td>{tipoAgenda.nombre}</td>
                        <td>{tipoAgenda.tipo}</td>
                        <td>{tipoAgenda.obligatorio? 'Si': 'No'}</td>
                        <td>{tipoAgenda.decimales}</td>
                        <td>{tipoAgenda.caracteres}</td>
                        <td>{tipoAgenda.maximo}</td>
                        <td>{tipoAgenda.minimo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarTiposDeProcesos;
