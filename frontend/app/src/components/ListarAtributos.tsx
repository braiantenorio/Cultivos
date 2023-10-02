import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { TipoAgenda } from "../types/tipoAgenda";
import swal from "sweetalert";
import { Atributo } from "../types/atributo";

function ListarAtributos() {
    const [atributos, setAtributos] = useState<Atributo[]>([]);

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
  
    return (
      <div className="container">
        <h2>Atributos </h2>
  
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
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
            {atributos.map((tipoAgenda, index) => (
              <tr key={tipoAgenda.id}>
                <td>{index + 1}</td>
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
      </div>
    );
}

export default ListarAtributos;
