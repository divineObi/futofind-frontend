import axios from 'axios';

const API_URL = 'https://futofind-api.onrender.com/api/notifications';

// Get all notifications for the current user
export const getNotifications = () => {
  return axios.get(API_URL);
};

// Mark all notifications as read
export const markNotificationsAsRead = () => {
  return axios.patch(`${API_URL}/read`);
};