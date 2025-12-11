import axios from "axios";

const API_URL = "https://localhost:7062/api/News";

// Merr të gjitha news (për HomeScreen dhe pacientët)
export const getAllNews = async () => {
  return await axios.get(`${API_URL}/all`, { withCredentials: true });
};

// Merr news sipas ID
export const getNewsById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

// Krijo news (për psikologët)
export const createNews = async (formData) => {
  return await axios.post(`${API_URL}/add`, formData, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Përditëso news (për psikologët)
export const updateNews = async (id, formData) => {
  return await axios.put(`${API_URL}/update/${id}`, formData, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Fshi news (për psikologët)
export const deleteNews = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};

// Merr news për një psikolog specifik
export const getNewsByPsikologId = async (psikologId) => {
  return await axios.get(`${API_URL}/psikolog/${psikologId}`, { withCredentials: true });
};