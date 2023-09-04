import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Categoria } from "../types/categoria";

const EditarLote: React.FC = () => {
	const { loteId } = useParams();
	const [lote, setLote] = useState({
		codigo: "",
		cantidad: 0,
		categoriaId: 0,
	});
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const navigate = useNavigate();
	const requestOptions = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(lote),
	};

	useEffect(() => {
		const url = `/lotes/id/${loteId}`;

		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error al realizar la solicitud: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				setLote(responseData.data);
			})
			.catch((error) => {
				console.error(error);
			});

		const categoriasUrl = "/categorias";
		fetch(categoriasUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error al realizar la solicitud: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				setCategorias(responseData.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [loteId]); 

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target;
		setLote((prevLote) => ({
			...prevLote,
			[name]: value,
		}));
	};

	const handleGuardarLote = () => {
		const url = `/lotes`;
		fetch(url, requestOptions)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error al realizar la solicitud: ${response.status}`);
				}
				return response.json();
			})
			.then((responseData) => {
				console.log("Lote actualizado:", responseData);
				navigate(-1);
			})
			.catch((error) => {
				console.error("Error al enviar la solicitud PUT:", error);
			});
	};

	const handleCancelar = () => {
		navigate(-1);
	};

	return (
		<div>
			<h1>Editar Lote</h1>
			<form>
				<div className="mb-3">
					<label htmlFor="codigo" className="form-label">
						Código:
					</label>
					<input
						type="text"
						className="form-control"
						id="codigo"
						name="codigo"
						value={lote.codigo}
						onChange={handleInputChange}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="cantidad" className="form-label">
						Cantidad:
					</label>
					<input
						type="number"
						className="form-control"
						id="cantidad"
						name="cantidad"
						value={lote.cantidad}
						onChange={handleInputChange}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="categoriaId" className="form-label">
						Categoría:
					</label>
					<select
						className="form-select"
						id="categoriaId"
						name="categoriaId"
						value={lote.categoriaId}
						onChange={handleInputChange}
					>
						<option value={0}>Seleccione una categoría</option>
						{categorias.map((categoria) => (
							<option key={categoria.id} value={categoria.id}>
								{categoria.nombre}
							</option>
						))}
					</select>
				</div>
				<div className="mb-3">
					<button
						type="button"
						className="btn btn-success"
						onClick={handleGuardarLote}
					>
						Guardar
					</button>
					<button
						type="button"
						className="btn btn-danger ms-2"
						onClick={handleCancelar}
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditarLote;
