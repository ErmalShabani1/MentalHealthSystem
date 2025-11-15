import axios from "axios";

const API_URL = "https://localhost:7062/api/Auth";

axios.defaults.withCredentials = true;

export const getCurrentUser = async () => {
  return await axios.get(`${API_URL}/me`, { withCredentials: true });
};

export const getAllUsers = async () => {
  return await axios.get(`${API_URL}/users`, { withCredentials: true });
};

export const getUserById = async (id) => {
  return await axios.get(`${API_URL}/users/${id}`, { withCredentials: true });
};

export const createUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
};

export const updateUser = async (id, userData) => {
  return await axios.put(`${API_URL}/users/${id}`, userData, { withCredentials: true });
};

export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/users/${id}`, { withCredentials: true });
};
