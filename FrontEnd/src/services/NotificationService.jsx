import axios from 'axios';

const API_URL = 'https://localhost:7062/api/Notification';

// Get JWT token from cookies
const getAuthToken = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1];
    return token;
};

// Get all notifications (Admin only)
export const getAllNotifications = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all notifications:', error);
        throw error;
    }
};

// Get notification by ID (All authenticated)
export const getNotificationById = async (id) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
    }
};

// Get my notifications (Pacient only)
export const getMyNotifications = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/my-notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching my notifications:', error);
        throw error;
    }
};

// Get unread count (Pacient only)
export const getUnreadCount = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/unread-count`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.count;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

// Get notifications by psikolog (Psikolog only)
export const getNotificationsByPsikolog = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/by-psikolog`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications by psikolog:', error);
        throw error;
    }
};

// Create notification (Psikolog only)
export const createNotification = async (notificationData) => {
    try {
        const token = getAuthToken();
        console.log('Sending:', JSON.stringify(notificationData));
        const response = await axios.post(`${API_URL}/add`, notificationData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        console.error('Response data:', error.response?.data);
        console.error('Validation errors:', JSON.stringify(error.response?.data?.errors, null, 2));
        throw error;
    }
};

// Update notification (Psikolog/Admin)
export const updateNotification = async (id, notificationData) => {
    try {
        const token = getAuthToken();
        const response = await axios.put(`${API_URL}/${id}`, notificationData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
    }
};

// Mark notification as read (Pacient only)
export const markNotificationAsRead = async (id) => {
    try {
        const token = getAuthToken();
        const response = await axios.put(`${API_URL}/mark-read/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
};

// Delete notification (Psikolog/Admin)
export const deleteNotification = async (id) => {
    try {
        const token = getAuthToken();
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
    }
};
