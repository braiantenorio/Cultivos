import React from "react";
import authHeader from "../services/auth-header";
import { Informe } from "../types/informe";

const DescargarExcelButton = ({ informe }: { informe: Informe }) => {
  const handleDescargarExcel = () => {
    // Realizar una solicitud GET al punto final que genera el archivo Excel
    console.log(informe);
    fetch("/export/toExcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader().Authorization,
      },
      body: JSON.stringify(informe),
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Crear un enlace temporal para la descarga del archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Planillas de Trazabilidad.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al descargar el archivo Excel:", error);
      });
  };

  return (
    <div>
      <button onClick={handleDescargarExcel} className="btn btn-success">
        <i className="bi bi-download"></i> Descargar
      </button>
    </div>
  );
};

export default DescargarExcelButton;
