// components/FilterComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterComponent = ({ onFilterChange, filterType }) => {
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    // Realiza una solicitud para obtener las opciones del filtro según el tipo
    axios.get(`http://localhost:2000/trips/${filterType}-types`)
      .then(response => {
        // Asigna las opciones del filtro a estado
        setFilterOptions(response.data);
      })
      .catch(error => {
        console.error(`Error al obtener las opciones del filtro ${filterType}:`, error);
      });
  }, [filterType]);

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setFilterValue(selectedValue);
    onFilterChange(selectedValue);
  };

  return (
    <div>
      <label htmlFor={filterType}>Filtrar por {filterType}:</label>
      <select id={filterType} value={filterValue} onChange={handleFilterChange}>
        <option value="">Masculino</option>
        <option value="">Femenino</option>
        {filterOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterComponent;
