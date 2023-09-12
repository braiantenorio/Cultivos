import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

import { Atributo } from '../types/atributo';
import { Proceso } from '../types/proceso';
import { Valor } from '../types/valor';

function CrearProceso() {
	const { listId } = useParams();
	const [atributos, setAtributos] = useState<Atributo[]>([]);
	const [formulario, setFormulario] = useState<{ [key: string]: string }>({});
	const [valores, setValores] = useState<Valor[]>([]);


	useEffect(() => {
		fetch(`/listaDeAtributos/id/${listId}`)
			.then((response) => response.json())
			.then((data) => {
				const atributos = data.data.atributos;
				setAtributos(atributos);
			})
			.catch((error) => console.error('Error fetching attributes:', error));
	}, []);

	const [nuevoProceso, setNuevoProceso] = useState<Proceso>({
		id: 0, 
		nombre: "",
		descripcion: "",
		valores: [], 
	});

	const agregarValor = (atributo: Atributo, valor: string) => {
		const nuevoValor: Valor = {
			atributo,
			valor,
			id: 0 //o -1
		};
		setValores([...valores, nuevoValor]);
	};

	const renderizarInput = (atributo: Atributo, index: number) => {
		switch (atributo.tipo) {
			case 'String':
				return (
					<input
						id={atributo.id.toString()}
						className="form-control"
						type="text"
						name={atributo.nombre}
						value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						maxLength={atributo.limiteCaracteres}
						onChange={(event) => handleFormularioChange(event, atributo.nombre)}
					/>
				);
			case 'int':
				return (
					<input
						className="form-control"
						id={atributo.id.toString()}
						type="number"
						name={atributo.nombre}
						value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						min={atributo.rangoMinimo}
						max={atributo.rangoMaximo}
						step={1 / Math.pow(10, atributo.limiteDecimales || 0)}
						onChange={(event) => handleFormularioChange(event, atributo.nombre)}
					/>
				);
			case 'fecha':
				return (
					<input
						className='form-control'
						id={atributo.id.toString()}
						type="date"
						name={atributo.nombre}
						value={formulario[atributo.nombre] || ''}
						required={atributo.obligatorio}
						onChange={(event) => handleFormularioChange(event, atributo.nombre)}
					/>
				);
			default:
				return <input className='form-control' key={atributo.id} type="text" />;
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, nombreAtributo: string) => {
		const { value } = event.target;
		setNuevoProceso((prevProceso) => ({
			...prevProceso,
			[nombreAtributo]: value,
		}));
	};

	const handleFormularioChange = (event: React.ChangeEvent<HTMLInputElement>, nombreAtributo: string) => {
		const { value } = event.target;
		setFormulario((prevFormulario) => ({
			...prevFormulario,
			[nombreAtributo]: value,
		}));
	};


	const handleSubmit = () => {
		const nProceso: Proceso = {
			id: 0, 
			nombre: nuevoProceso.nombre,
			descripcion: nuevoProceso.descripcion,
			valores: valores,
		};

		fetch('/procesos', {
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
	};

	return (
		<div className='container'>
			<form className='row g-3' onSubmit={handleSubmit}>
				<div className='col-md-7'>
					<label htmlFor='nombre' className='form-label'>
						Nombre del Proceso
					</label>
					<input
						id='nombre'
						className='form-control'
						type='text'
						name='nombre'
						value={nuevoProceso.nombre}
						onChange={(event) => handleInputChange(event, "nombre")}
						required
					/>
				</div>
				<div className='col-md-7'>
					<label htmlFor='descripcion' className='form-label'>
						Descripción del Proceso
					</label>
					<input
						id='descripcion'
						className='form-control'
						type='text'
						name='descripcion'
						value={nuevoProceso.descripcion}
						onChange={(event) => handleInputChange(event, "descripcion")}
						required
					/>
				</div>
				
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
