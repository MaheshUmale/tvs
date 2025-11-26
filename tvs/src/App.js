import React, { useState, useEffect } from 'react';
import { useFields } from './hooks/useFields';
import FilterSection from './components/FilterSection';
import ResultsTable from './components/ResultsTable';
import { getScreenerData } from './services/screenerService';

function App() {
  const { fields, loading: fieldsLoading, error: fieldsError } = useFields();
  const [filters, setFilters] = useState([]);
  const [columns, setColumns] = useState(['name', 'close', 'volume']);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const queryFilters = filters.map(f => {
      const baseFieldName = f.field.split('|')[0];
      const field = fields.find(field => field.name === baseFieldName);
      let right;
      if (f.operator === 'between') {
        right = [f.value, f.value2];
      } else {
        right = f.value;
      }

      if (field && (field.type.includes('price') || field.type.includes('number'))) {
        if(Array.isArray(right)) {
          right = right.map(Number);
        } else {
          right = Number(right);
        }
      }

      return {
        left: f.field,
        operation: f.operator,
        right,
      };
    });

    const query = {
      filter: queryFilters,
      options: {
        lang: 'en',
      },
      markets: ['america'],
      symbols: {
        query: {
          types: [],
        },
        tickers: [],
      },
      columns: [...new Set([...columns, 'name'])],
      sort: {
        sortBy: 'market_cap_basic',
        sortOrder: 'desc',
      },
      range: [0, 150],
    };

    try {
      const result = await getScreenerData(query);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fields.length > 0) {
      fetchData();
    }
  }, [columns, fields]);

  if (fieldsLoading) return <p>Loading fields...</p>;
  if (fieldsError) return <p>Error fetching fields: {fieldsError.message}</p>;

  return (
    <div className="App">
      <h1>TradingView Screener</h1>
      <FilterSection fields={fields} filters={filters} setFilters={setFilters} />
      <button onClick={fetchData}>Search</button>
      {loading && <p>Loading data...</p>}
      {error && <p>Error fetching data.</p>}
      <ResultsTable fields={fields} columns={columns} setColumns={setColumns} data={data} />
    </div>
  );
}

export default App;
