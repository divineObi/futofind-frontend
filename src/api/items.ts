import axios from 'axios';

const API_URL = 'https://futofind-api.onrender.com/api/items';

// This function now accepts FormData
export const reportItem = (itemData: FormData) => {
  // Axios will automatically set the correct 'Content-Type': 'multipart/form-data'
  // when you pass it a FormData object.
  return axios.post(API_URL, itemData);
};

// NEW: Function to get found items with optional filters
export const getFoundItems = (filters?: { keyword?: string; category?: string; }) => {
  // Convert the filters object into URL query parameters
  const params = new URLSearchParams();
  if (filters?.keyword) {
    params.append('keyword', filters.keyword);
  }
  if (filters?.category && filters.category !== 'All') { // Don't filter if 'All' is selected
    params.append('category', filters.category);
  }

  // Axios will automatically append the '?' and the params string to the URL
  return axios.get(API_URL, { params });
};

// NEW: Function to get a single item by its ID
export const getItemById = (itemId: string) => {
  return axios.get(`${API_URL}/${itemId}`);
};

// UPDATE this function signature to accept FormData
export const claimItem = (itemId: string, formData: FormData) => {
  // Axios will handle the content-type header automatically
  return axios.post(`${API_URL}/${itemId}/claim`, formData);
};