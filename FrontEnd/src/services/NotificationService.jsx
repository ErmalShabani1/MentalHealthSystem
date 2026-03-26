import axios from 'axios';

const notificationApi = axios.create({
    baseURL: 'https://localhost:7062/api/Notification',
    withCredentials: true,
});

// Get all notifications (Admin only)
export const getAllNotifications = async () => {
    try {
        const response = await notificationApi.get('/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all notifications:', error);
        throw error;
    }
};

// Get notification by ID (All authenticated)
export const getNotificationById = async (id) => {
    try {
        const response = await notificationApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching notification ${id}:`, error);
        throw error;
    }
};

// Get my notifications (Pacient only)
export const getMyNotifications = async () => {
    try {
        const response = await notificationApi.get('/my-notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching my notifications:', error);
        throw error;
    }
};

// Get unread count (Pacient only)
export const getUnreadCount = async () => {
    try {
        const response = await notificationApi.get('/unread-count');
        return response.data.count;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

// Get notifications by psikolog (Psikolog only)
export const getNotificationsByPsikolog = async () => {
    try {
        const response = await notificationApi.get('/by-psikolog');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications by psikolog:', error);
        throw error;
    }
};

// Create notification (Psikolog only)
export const createNotification = async (notificationData) => {
    try {
        console.log('Sending:', JSON.stringify(notificationData));
        const response = await notificationApi.post('/add', notificationData);
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
        const response = await notificationApi.put(`/${id}`, notificationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating notification ${id}:`, error);
        throw error;
    }
};

// Mark notification as read (Pacient only)
export const markNotificationAsRead = async (id) => {
    try {
        const response = await notificationApi.put(`/mark-read/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
};

// Delete notification (Psikolog/Admin)
export const deleteNotification = async (id) => {
    try {
        const response = await notificationApi.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
    }
};
