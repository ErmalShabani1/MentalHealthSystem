import axios from "axios";

const API_URL = "http://localhost:5054/api/Auth";

export const getCurrentUser = async () => {
  return await axios.get(`${API_URL}/me`, { withCredentials: true });
};
