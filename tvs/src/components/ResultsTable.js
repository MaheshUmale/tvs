import React, { useState } from 'react';
import { getField } from '../utils/fields';

const ResultsTable = ({ fields, columns, setColumns, data }) => {
  const [selectedField, setSelectedField] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');

  const getDisplayName = (fieldName) => {
    const field = getField(fields, fieldName);
    if (!field) return fieldName;

    const timeframe = fieldName.split('|')[1];
    if (timeframe) {
      return `${field.displayName} (${timeframe})`;
    }
    return field.displayName;
  };

  const handleAddField = () => {
    if (selectedField) {
      let fieldName = selectedField;
      if (selectedTimeframe) {
        fieldName += `|${selectedTimeframe}`;
      }
      if (!columns.includes(fieldName)) {
        setColumns([...columns, fieldName]);
      }
      setSelectedField('');
      setSelectedTimeframe('');
    }
  };

  const handleRemoveColumn = (field) => {
    setColumns(columns.filter((col) => col !== field));
  };

  const selectedFieldData = getField(fields, selectedField);

  return (
    <div>
      <h3>Results</h3>
      <div>
        <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
          <option value="">Select a field to add</option>
          {fields.map((field) => (
            <option key={field.name} value={field.name}>
              {field.displayName}
            </option>
          ))}
        </select>
        {selectedFieldData && selectedFieldData.timeframes.length > 0 && (
          <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)}>
            <option value="">default</option>
            {selectedFieldData.timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
          </select>
        )}
        <button onClick={handleAddField}>Add Column</button>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {getDisplayName(col)}
                <button onClick={() => handleRemoveColumn(col)}>x</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
