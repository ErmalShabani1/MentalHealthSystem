import axios from "axios";

const API_URL = "https://localhost:7062/api/Auth";

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
export const logoutUser = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
    } catch (err) {
        console.error("Logout request failed:", err?.response || err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("psikologId");
}
