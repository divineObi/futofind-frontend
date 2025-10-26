import axios from 'axios';

const API_URL = 'https://futofind-api.onrender.com/api/admin';

// Get all claims with a 'pending' status
export const getPendingClaims = () => {
  return axios.get(`${API_URL}/claims`);
};

// Resolve a claim by approving or rejecting it
export const resolveClaim = (claimId: string, decision: 'approved' | 'rejected') => {
  return axios.patch(`${API_URL}/claims/${claimId}`, { decision });
};