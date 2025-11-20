import axios from "axios";

const API_URL = "https://localhost:7062/api/HealthReport";


export const getAllRaportet = async () => {
  return await axios.get(`${API_URL}/get-all`, { withCredentials: true });
};


export const getRaportById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};


export const addRaportin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const updateRaportin = async (id, data) => {
  return await axios.put(`${API_URL}/update/${id}`, data, { withCredentials: true });
};

export const deleteRaportin = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};

export const getRaportetByPsikologId = async (psikologId) => {
  return await axios.get(`${API_URL}/psikolog/${psikologId}`, { withCredentials: true });
};

export const getRaportetByPatientId = async (patientId) => {
  return await axios.get(`${API_URL}/patient/${patientId}`, { withCredentials: true });
};

export const getMyRaportet = async () => {
  return await axios.get(`${API_URL}/my-reports`, { withCredentials: true });
};

export const getRaportetStats = async () => {
  return await axios.get(`${API_URL}/stats`, { withCredentials: true });
};

export const getRaportetThisMonth = async () => {
  return await axios.get(`${API_URL}/this-month`, { withCredentials: true });
};

export const searchRaportet = async (searchTerm) => {
  return await axios.get(`${API_URL}/search?term=${searchTerm}`, { withCredentials: true });
};