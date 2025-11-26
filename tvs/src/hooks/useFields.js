import { useState, useEffect } from 'react';
import { getFields } from '../services/fieldsService';

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getFields();
        setFields(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return { fields, loading, error };
};
