import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Atributo } from "../types/atributo";
import { Proceso } from "../types/proceso";
import { Valor } from "../types/valor";
import { TipoDeProceso } from "../types/tipoDeProceso";

function CrearProceso() {
  const { listId } = useParams();
  const { loteId } = useParams();
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [valores, setValores] = useState<Valor[]>([]);
  const [tipoDeProceso, setTipoDeProceso] = useState<TipoDeProceso>(
    {} as TipoDeProceso
  ); // aca falta asignar hay que arreglar

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/listaDeAtributos/nombre/${listId}`)
      .then((response) => response.json())
      .then((data) => {
        setTipoDeProceso(data.data);
        const valoresData: Valor[] = data.data.atributos.map(
          (atributo: Atributo) => ({
            id: null,
            atributo: atributo,
            valor: null,
          })
        );

        setAtributos(data.data.atributos);
        setValores(valoresData);	
		console.log(valores);	
      })
      .catch((error) => console.error("Error fetching attributes:", error));
  }, []);

  const handleAgregarValor = (
    event: React.ChangeEvent<HTMLInputElement>,
    nombreAtributo: string
  ) => {
	console.log("hola");
    const { value } = event.target;
    setValores(
      valores.map((valor) => {
        if (valor.atributo.nombre === nombreAtributo) {
          return { ...valor, valor: value };
        } else {
          return valor;
        }
      })
    );
  };

  const renderizarInput = (atributo: Atributo, index: number) => {
    switch (atributo.tipo) {
      case "string":
        return (
          <input
            id={atributo.id.toString()}
            className="form-control"
            type="text"
            name={atributo.nombre}
			//value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            maxLength={atributo.caracteres}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      case "int":
        return (
          <input
            className="form-control"
            id={atributo.id.toString()}
            type="number"
            name={atributo.nombre}
			//value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            min={atributo.minimo}
            max={atributo.maximo}
            step={1 / Math.pow(10, atributo.decimales || 0)}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      case "fecha":
        return (
          <input
            className="form-control"
            id={atributo.id.toString()}
            type="date"
            name={atributo.nombre}
			//value={valores.find((valor) => valor.atributo.nombre === atributo.nombre)?.valor || ''}
            required={atributo.obligatorio}
            onChange={(event) => handleAgregarValor(event, atributo.nombre)}
          />
        );
      default:
        return <input className="form-control" key={atributo.id} type="text" />;
    }
  };

  const handleSubmit = () => {
    const nProceso: Proceso = {
      id: 0,
      usuario: null,
      fecha: null,
      valores: valores,
      tipoDeProceso: tipoDeProceso,
    };

    fetch(`/procesos/lote/${loteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nProceso),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => {
        console.error("Error al crear el proceso:", error);
      });

    fetch(`/procesos/completar/${loteId}/${listId}`, {
      method: "PUT", // O el método HTTP adecuado
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        fetch(`/lotes/id/${loteId}`).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al realizar la solicitud: ${response.status}`
            );
          }
          return response.json();
        });
      })
      .catch((error) => {
        console.error(error);
      });

    navigate(-1);
  };

  return (
    <div className="container">
      <h2>Nuevo Proceso - {tipoDeProceso.nombre}</h2>
      <form className="row g-3" onSubmit={handleSubmit}>
        {tipoDeProceso.atributos?.map((atributo, index) => (
          <div className="col-md-7" key={atributo.id}>
            <label htmlFor={atributo.id.toString()} className="form-label">
              {atributo.nombre}
            </label>
            {renderizarInput(atributo, index)}
          </div>
        ))}
        <div className="col-md-12">
          <button type="submit" className="btn btn-success">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearProceso;
