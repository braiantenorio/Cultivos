import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

import { Atributo } from '../types/atributo';
import { Proceso } from '../types/proceso';
import { Valor } from '../types/valor';

function CrearProceso() {
	const { listId } = useParams();
	const { loteId } = useParams();
	const [atributos, setAtributos] = useState<Atributo[]>([]);
	const [valores, setValores] = useState<Valor[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`/listaDeAtributos/id/${listId}`)
			.then((response) => response.json())
			.then((data) => {
				const atributosData = data.data.atributos;
				const valoresData: Valor[] = atributosData.map((atributo: Atributo) => ({
					id: null,
					atributo: atributo,
					valor: null,
				}));

				setAtributos(atributosData);
				setValores(valoresData);


			})
			.catch((error) => console.error('Error fetching attributes:', error));
	}, []);


	const handleAgregarValor = (event: React.ChangeEvent<HTMLInputElement>, nombreAtributo: string) => {
		const { value } = event.target;
		setValores(valores.map(valor => {
			if (valor.atributo.nombre === nombreAtributo) {
				return { ...valor, valor: value };
			} else {
				return valor;
			}
		}));
	};

	const renderizarInput = (atributo: Atributo, index: number) => {
		switch (atributo.tipo) {
			case 'string':
				return (
					<input
						id={atributo.id.toString()}
						className="form-control"
						type="text"
						name={atributo.nombre}
						//value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						maxLength={atributo.limiteCaracteres}
						onChange={(event) => handleAgregarValor(event, atributo.nombre)}
					/>
				);
			case 'int':
				return (
					<input
						className="form-control"
						id={atributo.id.toString()}
						type="number"
						name={atributo.nombre}
						//value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						min={atributo.rangoMinimo}
						max={atributo.rangoMaximo}
						step={1 / Math.pow(10, atributo.limiteDecimales || 0)}
						onChange={(event) => handleAgregarValor(event, atributo.nombre)}
					/>
				);
			case 'fecha':
				return (
					<input
						className='form-control'
						id={atributo.id.toString()}
						type="date"
						name={atributo.nombre}
						//value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						onChange={(event) => handleAgregarValor(event, atributo.nombre)}
					/>
				);
			default:
				return <input className='form-control' key={atributo.id} type="text" />;
		}
	};

	const handleSubmit = () => {
		const nProceso: Proceso = {
			id: 0,
			usuario: null,
			fecha: null,
			valores: valores,
		};

		fetch(`/procesos/lote/${loteId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(nProceso),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Respuesta del servidor:', data);
			})
			.catch((error) => {
				console.error('Error al crear el proceso:', error);
			});
		navigate(-1);
	};

	return (
		<div className='container'>
			<h2>NOMBRE DEL ATRIBUTO</h2>
			<form className='row g-3' onSubmit={handleSubmit}>
				{atributos.map((atributo, index) => (
					<div className='col-md-7' key={atributo.id}>
						<label htmlFor={atributo.id.toString()} className='form-label'>{atributo.nombre}</label>
						{renderizarInput(atributo, index)}
					</div>
				))}
				<div className='col-md-12'>
					<button type='submit' className='btn btn-success'>Enviar</button>
				</div>
			</form>
		</div>
	);
}

export default CrearProceso;
