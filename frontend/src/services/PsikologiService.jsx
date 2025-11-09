import axios from "axios";

const API_URL = "http://localhost:5054/api/Psikologi";

export const getAllPsikologet = async () => {
  return await axios.get(`${API_URL}/get-all`, { withCredentials: true });
};

export const addPsikologin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const updatePsikologin = async (id, data) => {
  return await axios.put(`${API_URL}/update/${id}`, data, { withCredentials: true });
};

export const deletePsikologin = async (id) => {
  return await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
};