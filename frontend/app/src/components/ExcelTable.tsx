import React, { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { Categoria } from "../types/categoria";
import { Informe } from "../types/informe";
import { Atributo } from "../types/atributo";
import DescargarExcelButton from "./DescargarExcelButton";

const InformeComponent = () => {
  const [activeTab, setActiveTab] = useState("Stock");
  const [generado, setGenerado] = useState(false);
  const [informe, setInforme] = useState<Informe>({} as Informe);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const fechaHoy = new Date().toISOString().split("T")[0];

  // Nuevo estado para el atributo seleccionado
  const [selectedAtributo, setSelectedAtributo] = useState<
    Atributo | undefined
  >();

  // Nuevo estado para controlar la visibilidad del formulario de agregar atributo
  const [isAddAtributoFormVisible, setIsAddAtributoFormVisible] =
    useState(false);
  useEffect(() => {
    const url = "/categorias/search";
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
        // Primero, establece las categorías
        setCategorias(responseData.data);

        // Luego, utiliza las categorías para crear nuevosDDJJ y actualizar el informe
        const nuevosDDJJ = responseData.data.map((categoria: any) => {
          return {
            categoria,
            atributos: [],
            lotesDDJJ: [],
          };
        });

        setInforme({
          stock: {
            atributos: [],
            lotesStock: [],
          },
          ddjjs: nuevosDDJJ,
          fechaDesde: fechaHoy,
          fechaHasta: fechaHoy,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    const url1 = "/atributos/search";
    fetch(url1, {
      headers: authHeader(),
    })
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

  const changeTab = (tabName: string) => {
    setActiveTab(tabName);
  };
  const handleAtributoChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAtributoId = Number(event.target.value); // Convierte a número
    const selectedAtributo = atributos.find(
      (atributo) => atributo.id === selectedAtributoId
    );
    setSelectedAtributo(selectedAtributo);
  };

  const handleGuardarAtributo = () => {
    if (selectedAtributo) {
      setInforme((prevInforme) => {
        if (prevInforme) {
          // Crea una copia profunda de informe para evitar mutaciones
          const updatedInforme = JSON.parse(JSON.stringify(prevInforme));

          if (activeTab === "Stock") {
            // Agrega el atributo seleccionado a la lista de atributos de stock
            updatedInforme.stock!.atributos.push(selectedAtributo);
          } else {
            // Encuentra el DDJJ correspondiente
            const ddjj = updatedInforme.ddjjs!.find(
              (ddjj: { categoria: { nombre: string } }) =>
                ddjj.categoria.nombre === activeTab
            );
            if (ddjj) {
              // Agrega el atributo seleccionado a la lista de atributos de ese DDJJ
              ddjj.atributos.push(selectedAtributo);
            }
          }

          // Limpia el atributo seleccionado y oculta el formulario
          setSelectedAtributo(undefined);
          setIsAddAtributoFormVisible(false);

          return updatedInforme;
        }
        return prevInforme;
      });
    }
  };

  const handleGenerarInforme = () => {
    console.log(informe);
    const url = "/export/generar-informe"; // Reemplaza con la URL correcta

    fetch(url, {
      method: "POST", // Puedes usar POST u otro método según tus necesidades
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(informe),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setInforme(responseData.data);
        setGenerado(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlefecha = (e: any) => {
    setInforme((prevInforme) => ({
      ...prevInforme,
      fechaDesde: e,
    }));
  };
  const handlefecha1 = (e: any) => {
    setInforme((prevInforme) => ({
      ...prevInforme,
      fechaHasta: e,
    }));
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center flex-wrap">
        <h2 className="mb-2">Nuevo Informe</h2>
        &nbsp;&nbsp; &nbsp;
        <button
          className="btn btn-success me-2 mb-1"
          onClick={handleGenerarInforme}
        >
          Generar Informe
        </button>
        &nbsp;&nbsp;
      </div>
      <div className="row align-items-center">
        <div className="col-md-4 col-12 mb-2 mt-2 d-flex align-items-center">
          <label htmlFor="fechaDesde" className="me-2">
            Desde:
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaDesde"
            name="fechaDesde"
            value={informe?.fechaDesde}
            onChange={(event) => handlefecha(event.target.value)}
          />
        </div>
        <div className="col-md-4 col-12 mb-2 mt-2 d-flex align-items-center">
          <label htmlFor="fechaHasta" className="me-2">
            Hasta:
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaHasta"
            name="fechaHasta"
            value={informe?.fechaHasta}
            onChange={(event) => handlefecha1(event.target.value)}
          />
        </div>
        {generado && (
          <div className="col-md-4 col-12 mb-2 mt-2 d-flex justify-content-md-end justify-content-start">
            <DescargarExcelButton informe={informe} />
          </div>
        )}
      </div>

      <ul className="mb-3"></ul>
      <ul className="mb-3"></ul>
      <div className="row">
        <div className="col-12 col-md-2 mb-3">
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "Stock" ? "active" : ""}`}
                onClick={() => changeTab("Stock")}
              >
                Stock Materiales
              </a>
            </li>
            {categorias.map((categoria, index) => (
              <li className="nav-item" key={index}>
                <a
                  className={`nav-link ${
                    activeTab === categoria.nombre ? "active" : ""
                  }`}
                  href="#"
                  onClick={() => changeTab(categoria.nombre)}
                >
                  DDJJ {categoria.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-12 col-md-9">
          {activeTab === "Stock" ? (
            <div>
              <div className="d-flex align-items-center flex-wrap mb-3">
                <h3>
                  <span>Detalles Stock de Materiales</span>
                </h3>
                <button
                  hidden
                  className="btn btn-primary ms-2"
                  onClick={() => setIsAddAtributoFormVisible(true)}
                >
                  Agregar Atributo
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Variedad</th>
                      <th>Cantidad</th>
                      <th>Categoria</th>
                      {informe?.stock?.atributos?.map((atributo) => (
                        <th key={atributo.id}>{atributo.nombre}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {informe?.stock?.lotesStock?.map((lote, index) => (
                      <tr key={index}>
                        <td>{lote.codigo}</td>
                        <td>{lote.variedad}</td>
                        <td>{lote.cantidad}</td>
                        <td>{lote.categoria}</td>
                        {informe?.stock?.atributos?.map((atributo) => (
                          <td key={atributo.id}>
                            {
                              lote.valores?.find(
                                (valor) => valor.atributo.id === atributo.id
                              )?.valor
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h3>
                Detalle DDJJ {activeTab}
                &nbsp;&nbsp;
                <button
                  hidden
                  className="btn btn-primary ms-2"
                  onClick={() => setIsAddAtributoFormVisible(true)}
                >
                  Agregar Atributo
                </button>
              </h3>

              {/* Muestra los detalles específicos de la categoría seleccionada aquí */}
              {informe?.ddjjs?.map((ddjj, index) => {
                if (ddjj.categoria.nombre === activeTab) {
                  return (
                    <div key={index}>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Variedad</th>
                              <th>Cantidad</th>
                              <th>fecha</th>
                              <th>Codigo Padre</th>
                              <th>Categoria Padre</th>

                              {ddjj?.atributos?.map((atributo) => (
                                <th key={atributo.id}>{atributo.nombre}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {ddjj?.lotesDDJJ?.map((lote, index) => (
                              <tr key={index}>
                                <td>{lote.codigo}</td>
                                <td>{lote.variedad}</td>
                                <td>{lote.cantidad}</td>
                                <td>
                                  {" "}
                                  {new Date(
                                    new Date(lote.fecha).getTime() +
                                      24 * 60 * 60 * 1000
                                  ).toLocaleDateString()}
                                </td>
                                <td>{lote?.codigoPadre}</td>
                                <td>{lote?.categoriaPadre}</td>
                                {ddjj?.atributos?.map((atributo) => (
                                  <td key={atributo.id}>
                                    {
                                      lote.valores?.find(
                                        (valor) =>
                                          valor.atributo.id === atributo.id
                                      )?.valor
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
          {isAddAtributoFormVisible && (
            <div className="mb-3">
              <select
                onChange={handleAtributoChange}
                value={selectedAtributo ? selectedAtributo.id : ""}
              >
                <option value="">Selecciona un atributo</option>
                {atributos.map((atributo) => (
                  <option key={atributo.id} value={atributo.id}>
                    {atributo.nombre}
                  </option>
                ))}
              </select>
              &nbsp;&nbsp;
              <button
                className="btn btn-primary ms-2"
                onClick={handleGuardarAtributo}
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeComponent;
