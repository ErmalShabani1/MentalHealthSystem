import api from './api';

// Get all therapy sessions (Psikolog only)
export const getAllTherapySessions = async () => {
    return await api.get('/TherapySession/all');
};

// Get therapy session by ID
export const getTherapySessionById = async (id) => {
    return await api.get(`/TherapySession/${id}`);
};

// Get sessions by patient ID
export const getSessionsByPatientId = async (patientId) => {
    return await api.get(`/TherapySession/patient/${patientId}`);
};

// Get my sessions (Patient only)
export const getMySessions = async () => {
    return await api.get('/TherapySession/my-sessions');
};

// Get sessions by psikolog ID
export const getSessionsByPsikologId = async (psikologId) => {
    return await api.get(`/TherapySession/psikolog/${psikologId}`);
};

// Create therapy session (Psikolog only)
export const createTherapySession = async (sessionData) => {
    return await api.post('/TherapySession/add', sessionData);
};

// Update therapy session (Psikolog only)
export const updateTherapySession = async (id, sessionData) => {
    return await api.put(`/TherapySession/${id}`, sessionData);
};

// Delete therapy session (Psikolog only)
export const deleteTherapySession = async (id) => {
    return await api.delete(`/TherapySession/${id}`);
};
