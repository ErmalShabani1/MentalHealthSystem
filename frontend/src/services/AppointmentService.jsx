import axios from "axios";

const API_URL = "http://localhost:5054/api/Appointments";

export const getTakimetByPsikologId = async (id) => {
  return await axios.get(`${API_URL}/psikolog/${id}`, { withCredentials: true });
};

export const addTakimin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const updateTakimin = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
};

export const deleteTakimin = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
export const getAllAppointmentsAdmin = async () => {
  return await axios.get(`${API_URL}/all`);
};

export const getPatientReports = async (psikologId) => {
  return await axios.get(`${API_URL}/reports/psikolog/${psikologId}`, { withCredentials: true });
};