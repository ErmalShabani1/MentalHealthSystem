import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyNotifications, markNotificationAsRead, getUnreadCount } from '../../services/NotificationService';
import '../../styles/auth.css';

function MyNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getMyNotifications();
            setNotifications(data);
        } catch (error) {
            toast.error('Gabim në ngarkim e njoftimeve');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            toast.success('Njoftimi u shënua si i lexuar');
            fetchNotifications(); // Refresh list
            fetchUnreadCount(); // Update badge count
        } catch (error) {
            toast.error('Gabim në shënimin e njoftimit');
            console.error(error);
        }
    };

    const handleLogout = () => {
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/pacientDashboard');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('sq-AL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <div
                className="bg-dark text-white p-2 d-flex flex-column"
                style={{ 
                    width: "180px", 
                    position: "fixed", 
                    height: "100vh",
                    overflowY: "auto"
                }}
            >
                {/* Dashboard */}
                <div className="mb-2">
                    <Link to="/pacientDashboard" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.85rem'}}>
                        🏠 Dashboard
                    </Link>
                </div>

                {/* Njoftimet */}
                <div className="mb-2">
                    <div className="text-white mb-1 px-1 py-1">
                        <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>🔔 Njoftimet</small>
                    </div>
                    <Link to="/my-notifications" className="nav-link text-white px-2 py-1 mb-1 active d-flex align-items-center justify-content-between" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', fontSize: '0.8rem'}}>
                        <span>📬 Njoftimet e mia</span>
                        {unreadCount > 0 && (
                            <span className="badge bg-danger rounded-circle" style={{fontSize: '0.7rem', padding: '0.25rem 0.5rem'}}>
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="btn btn-danger btn-sm w-100 py-1 mb-2" style={{fontSize: '0.8rem'}}>
                        🚪 Logout
                    </button>
                    <button onClick={handleBack} className="btn btn-secondary btn-sm w-100 py-1" style={{fontSize: '0.8rem'}}>
                        ← Kthehu
                    </button>
                </div>
            </div>

            {/* Përmbajtja kryesore */}
            <div className="flex-grow-1" style={{ marginLeft: "180px", backgroundColor: "#f8f9fa", overflowY: "auto", minHeight: "100vh" }}>
                <div className="container-fluid py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Njoftimet e mia</h2>
                    </div>

                {loading ? (
                    <div className="loading">Po ngarkohet...</div>
                ) : (
                    <div className="table-container">
                        {notifications.length === 0 ? (
                            <p className="no-data">Nuk ka njoftime.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Statusi</th>
                                        <th>Titulli</th>
                                        <th>Mesazhi</th>
                                        <th>Psikologu</th>
                                        <th>Data e Dërgimit</th>
                                        <th>Data e Leximit</th>
                                        <th>Veprime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification) => (
                                        <tr 
                                            key={notification.notificationId}
                                            className={notification.isRead ? '' : 'unread-notification'}
                                        >
                                            <td>
                                                {notification.isRead ? (
                                                    <span className="badge badge-success">I lexuar</span>
                                                ) : (
                                                    <span className="badge badge-warning">I palexuar</span>
                                                )}
                                            </td>
                                            <td><strong>{notification.title}</strong></td>
                                            <td>{notification.message}</td>
                                            <td>{notification.psikologName}</td>
                                            <td>{formatDate(notification.sentAt)}</td>
                                            <td>{formatDate(notification.readAt)}</td>
                                            <td>
                                                {!notification.isRead && (
                                                    <button
                                                        className="btn-action btn-edit"
                                                        onClick={() => handleMarkAsRead(notification.notificationId)}
                                                    >
                                                        Shëno si të lexuar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default MyNotifications;
