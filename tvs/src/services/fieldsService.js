import axios from 'axios';

const FIELDS_URL = 'https://shner-elmo.github.io/TradingView-Screener/fields/stocks.html';

export const getFields = async () => {
  try {
    const response = await axios.get(FIELDS_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'text/html');
    const fields = [];
    doc.querySelectorAll('tr').forEach(row => {
      const columns = row.querySelectorAll('td');
      if (columns.length === 3) {
        const name = columns[0].textContent.trim().split('\n')[0].trim();
        const displayName = columns[1].textContent.trim();
        const type = columns[2].textContent.trim();
        const timeframes = [];
        const ul = columns[0].querySelector('ul');
        if (ul) {
          ul.querySelectorAll('li').forEach(li => {
            const parts = li.textContent.trim().split('|');
            if(parts.length > 1) {
              timeframes.push(parts[1]);
            }
          });
        }
        fields.push({ name, displayName, type, timeframes });
      }
    });
    if (fields.length === 0) {
      throw new Error('No fields found. The structure of the fields page may have changed.');
    }
    return fields;
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
};
