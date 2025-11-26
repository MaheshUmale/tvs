import axios from 'axios';

const API_URL = '/api/scan';

export const getScreenerData = async (query) => {
  try {
    const response = await axios.post(API_URL, query);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching screener data:', error);
    throw error;
  }
};
