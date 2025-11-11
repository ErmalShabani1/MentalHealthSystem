import axios from "axios";

const API_URL = "https://localhost:7062/api/Patient";

export const getAllPatients = async () => {
  return await axios.get(`${API_URL}/get-all`, { withCredentials: true });
};

export const addPacientin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const updatePacientin = async (id, data) => {
  return await axios.put(`${API_URL}/update/${id}`, data, { withCredentials: true });
};

export const deletePacientin = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
export const getPatientById = async (id) => {
  return await axios.get(`https://localhost:7062/api/Patient/${id}`, { withCredentials: true });
};