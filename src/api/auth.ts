import axios from 'axios';

const API_URL = 'https://futofind-api.onrender.com/api/auth'; // Our backend auth route

// User registration
export const register = (userData: any) => {
  return axios.post(`${API_URL}/register`, userData);
};

// User login
export const login = (userData: any) => {
  return axios.post(`${API_URL}/login`, userData);
};