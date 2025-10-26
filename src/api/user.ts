import axios from 'axios';

const API_URL = 'https://futofind-api.onrender.com/api/users';

// Get all items reported BY the logged-in user
export const getMyReportedItems = () => {
  return axios.get(`${API_URL}/my-items`);
};

// Get all claims made BY the logged-in user
export const getMyClaims = () => {
  return axios.get(`${API_URL}/my-claims`);
};