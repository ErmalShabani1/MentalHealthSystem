import axios from "axios";

const API_URL = "https://localhost:7062/api/Auth";

export const getCurrentUser = async () => {
  return await axios.get(`${API_URL}/me`, { withCredentials: true });
};
