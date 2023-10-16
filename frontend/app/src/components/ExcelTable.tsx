import React, { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { Categoria } from "../types/categoria";
import { Informe } from "../types/informe";
import { Atributo } from "../types/atributo";
import DescargarExcelButton from "./DescargarExcelButton";

const InformeComponent = () => {
  const [activeTab, setActiveTab] = useState("Stock");
  const [generado, setGenerado] = useState(false);
  const [informe, setInforme] = useState<Informe | null>({
    stock: {
      atributos: [],
      lotesStock: [],
    },
    ddjjs: [],
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [atributos, setAtributos] = useState<Atributo[]>([]);

  // Nuevo estado para el atributo seleccionado
  const [selectedAtributo, setSelectedAtributo] = useState<
    Atributo | undefined
  >();

  // Nuevo estado para controlar la visibilidad del formulario de agregar atributo
  const [isAddAtributoFormVisible, setIsAddAtributoFormVisible] =
    useState(false);
  useEffect(() => {
    const url = "/categorias";
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
        });
      })
      .catch((error) => {
        console.error(error);
      });

    const url1 = "/atributos";
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

  return (
    <div className="container">
      <h2>
        Nuevo Informe{"      "}&nbsp;&nbsp;
        <button className="btn btn-success" onClick={handleGenerarInforme}>
          Generar Informe
        </button>
      </h2>
      {generado && (
        <div className="descargar-button-container">
          <DescargarExcelButton informe={informe!} />
        </div>
      )}
      <ul></ul>
      <ul></ul>
      <div className="row">
        <div className="col-2">
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
        <div className="col-9">
          {activeTab === "Stock" ? (
            <div>
              <h3>
                Detalles Stock Materiales &nbsp;&nbsp;
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddAtributoFormVisible(true)}
                >
                  Agregar Atributo
                </button>
              </h3>

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
          ) : (
            <div>
              <h3>
                Detalle DDJJ {activeTab}
                &nbsp;&nbsp;
                <button
                  className="btn btn-primary"
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
                  );
                }
                return null;
              })}
            </div>
          )}
          {isAddAtributoFormVisible && (
            <div>
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
                className="btn btn-primary"
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
