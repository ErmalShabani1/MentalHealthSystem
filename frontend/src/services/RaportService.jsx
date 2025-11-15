import axios from "axios";

const API_URL = "https://localhost:7062/api/HealthReport";

// Merr të gjitha raportet
export const getAllRaportet = async () => {
  return await axios.get(`${API_URL}/get-all`, { withCredentials: true });
};

// Merr raportin me ID
export const getRaportById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

// Shto raport të ri
export const addRaportin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

// Përditëso raportin
export const updateRaportin = async (id, data) => {
  return await axios.put(`${API_URL}/update/${id}`, data, { withCredentials: true });
};

// Fshi raportin
export const deleteRaportin = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};

// Merr raportet e një psikologu specifik
export const getRaportetByPsikologId = async (psikologId) => {
  return await axios.get(`${API_URL}/psikolog/${psikologId}`, { withCredentials: true });
};

// Merr raportet e një pacienti specifik
export const getRaportetByPatientId = async (patientId) => {
  return await axios.get(`${API_URL}/patient/${patientId}`, { withCredentials: true });
};

// Merr raportet e pacientit aktual (për pacientët)
export const getMyRaportet = async () => {
  return await axios.get(`${API_URL}/my-reports`, { withCredentials: true });
};

// Statistikat për admin
export const getRaportetStats = async () => {
  return await axios.get(`${API_URL}/stats`, { withCredentials: true });
};

// Raportet e këtij muaji
export const getRaportetThisMonth = async () => {
  return await axios.get(`${API_URL}/this-month`, { withCredentials: true });
};

// Kërko raporte
export const searchRaportet = async (searchTerm) => {
  return await axios.get(`${API_URL}/search?term=${searchTerm}`, { withCredentials: true });
};