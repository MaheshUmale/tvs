import React, { useState } from 'react';
import { getField } from '../utils/fields';

const OPERATORS = ['equal', 'greater', 'less', 'between'];

const FilterSection = ({ fields, filters, setFilters }) => {
  const [selectedField, setSelectedField] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('equal');
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');

  const handleAddField = () => {
    if (selectedField) {
      const field = getField(fields, selectedField);
      if (!field) return;

      let fieldName = selectedField;
      if (selectedTimeframe) {
        fieldName += `|${selectedTimeframe}`;
      }

      const newFilter = {
        field: fieldName,
        operator: selectedOperator,
        value: value,
      };
      if (selectedOperator === 'between') {
        newFilter.value2 = value2;
      }
      setFilters([...filters, newFilter]);
      setSelectedField('');
      setSelectedTimeframe('');
      setSelectedOperator('equal');
      setValue('');
      setValue2('');
    }
  };

  const handleRemoveFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleFilterChange = (index, key, newValue) => {
    const newFilters = [...filters];
    newFilters[index][key] = newValue;
    setFilters(newFilters);
  };

  const selectedFieldData = getField(fields, selectedField);

  return (
    <div>
      <h3>Filters</h3>
      <div>
        <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
          <option value="">Select a field</option>
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
        <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)}>
          {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
        <input
          type={selectedFieldData && selectedFieldData.type.includes('price') ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {selectedOperator === 'between' && (
          <input
            type={selectedFieldData && selectedFieldData.type.includes('price') ? 'number' : 'text'}
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        )}
        <button onClick={handleAddField}>Add Filter</button>
      </div>
      {filters.map((filter, index) => {
        const fieldData = getField(fields, filter.field);
        return (
          <div key={index}>
            <span>{fieldData.displayName} {filter.operator}</span>
            <input
              type={fieldData && fieldData.type.includes('price') ? 'number' : 'text'}
              value={filter.value}
              onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            />
            {filter.operator === 'between' && (
              <input
                type={fieldData && fieldData.type.includes('price') ? 'number' : 'text'}
                value={filter.value2}
                onChange={(e) => handleFilterChange(index, 'value2', e.target.value)}
              />
            )}
            <button onClick={() => handleRemoveFilter(index)}>Remove</button>
          </div>
        )
      })}
    </div>
  );
};

export default FilterSection;
