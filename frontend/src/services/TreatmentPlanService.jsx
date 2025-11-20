import axios from "axios";

const API_URL = "https://localhost:7062/api/TreatmentPlan";

export const addTreatmentPlan = async (data) => {
  return await axios.post(`${API_URL}/add`, data, { withCredentials: true });
};

export const getTreatmentPlanById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

export const updateTreatmentPlan = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
};

export const deleteTreatmentPlan = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};

export const getTreatmentPlansForPsikolog = async () => {
  return await axios.get(`${API_URL}/for-psikolog`, { withCredentials: true });
};

export const getTreatmentPlansForPatient = async () => {
  return await axios.get(`${API_URL}/for-patient`, { withCredentials: true });
};

export const getMyTreatmentPlans = async () => {
  return await axios.get(`${API_URL}/for-patient`, { withCredentials: true });
};