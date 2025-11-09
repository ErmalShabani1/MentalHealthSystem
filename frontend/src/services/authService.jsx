import axios from "axios";

const API_URL = "http://localhost:5054/api/Auth";

axios.defaults.withCredentials = true;

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};
export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};
export const refreshToken = async () => {
    return await axios.post(`${API_URL}/refresh-token`);
}
