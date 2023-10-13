import React, { useState, useEffect, useRef } from "react";
import authHeader from "../services/auth-header";

interface AutoCompleteProps {
  onOptionSelect: (option: string) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ onOptionSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const autoCompleteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inputValue.trim() !== "") {
      fetchResults(inputValue);
    } else {
      setFilteredOptions([]); // Limpiar los resultados si no hay entrada
    }
  }, [inputValue]);

  const fetchResults = async (searchTerm: string) => {
    try {
      const response = await fetch(`/lotes/search?term=${searchTerm}`, {
        headers: authHeader(),
      });

      if (response.ok) {
        const results = await response.json();
        setFilteredOptions(results.data);
      } else {
        console.error("Error al buscar:", response.statusText);
      }
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autoCompleteRef.current &&
        !autoCompleteRef.current.contains(event.target as Node)
      ) {
        setFilteredOptions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onOptionSelect(value);
    setSelectedOption(null); // Limpia la opción seleccionada cuando se cambia la entrada
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    setSelectedOption(option);
    setFilteredOptions([]); // Limpia las opciones para ocultar la lista
    onOptionSelect(option);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={autoCompleteRef}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Buscar lote o proceso"
        className="form-control"
      />
      {filteredOptions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1,
            width: "200px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Agrega una sombra suave
            borderRadius: "4px", // Esquinas redondeadas
          }}
        >
          {filteredOptions.map(
            (option, index) =>
              option !== selectedOption && (
                <li
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px", // Espaciado interior
                    transition: "background-color 0.3s",
                    borderBottom: "1px solid #e0e0e0", // Línea divisoria
                  }}
                >
                  {option}
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
