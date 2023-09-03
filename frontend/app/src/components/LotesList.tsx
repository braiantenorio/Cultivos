import { Lote } from '../types/lote';
import React, { useEffect, useState } from 'react';

function Loteslist() {
  const [lotes, setLotes] = useState<Lote[]>([]); 

  useEffect(() => {
    const url = '/lotes';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setLotes(responseData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Lotes</h2>
      <ul>

        <table className="table" >
          <thead>
            <tr>
              <th>#</th>
              <th>Codigo</th>
              <th>Cantidad</th>
              <th>Categoria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            {lotes.map((lote, index) => (
              <tr >
                <td>{index + 1}</td>
                <td>{lote.codigo}</td>
                <td>{lote.cantidad}</td>
                <td>{lote.categoria.nombre}</td>

              </tr>
            ))}
          </tbody>
        </table>

      </ul>
    </div>
  );
}

export default Loteslist;