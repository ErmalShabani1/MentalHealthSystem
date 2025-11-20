import axios  from "axios";

const API_URL = "https://localhost:7062/api/TreatmentPlan";

export const getById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};
export const addPlanin = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};
export const updatePlanin = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
};

export const deletePlanin = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
export const getPsikologPlans = async () => {
  return await axios.get(`${url}/psikolog`, { withCredentials: true });
};

export const getPatientPlans = async () => {
  return await axios.get(`${url}/patient`, { withCredentials: true });
};