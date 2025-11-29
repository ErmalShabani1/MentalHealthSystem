import axios from "axios";

const API_URL = "https://localhost:7062/api/Ushtrimet";

export const addUshtrim = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const getUshtrimById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

export const updateUshtrim = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
};

export const deleteUshtrim = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};

export const getUshtrimetForPsikolog = async (psikologId) => {
  return await axios.get(`${API_URL}/psikolog/${psikologId}`, {
    withCredentials: true,
  });
};

export const getMyUshtrimet = async () => {
  return await axios.get(`${API_URL}/for-patient`, { withCredentials: true });
};
