import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNotificationsByPsikolog, deleteNotification } from '../../services/NotificationService';
import '../../styles/auth.css';

function MenaxhoNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotificationsByPsikolog();
            setNotifications(data);
        } catch (error) {
            toast.error('Gabim në ngarkim e njoftimeve');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni të sigurt që doni të fshini këtë njoftim?')) {
            try {
                await deleteNotification(id);
                toast.success('Njoftimi u fshi me sukses');
                fetchNotifications();
            } catch (error) {
                toast.error('Gabim në fshirjen e njoftimit');
                console.error(error);
            }
        }
    };

    const handleLogout = () => {
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
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
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "250px", position: "fixed", height: "100vh" }}>
                <div className="mb-3">
                    <Link to="/psikologDashboard" className="nav-link text-white px-3 py-2 mb-1" style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px" }}>
                        🏠 Dashboard
                    </Link>
                </div>
                <div className="mb-3">
                    <div className="text-white mb-2 px-2 py-1">
                        <small className="text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                            📢 NJOFTIMET
                        </small>
                    </div>
                    <Link to="/add-notification" className="nav-link text-white px-3 py-2 mb-1">
                        ➕ Shto Njoftim
                    </Link>
                    <Link to="/menaxho-notifications" className="nav-link text-white px-3 py-2 mb-1 active" style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px" }}>
                        📊 Menaxho Njoftimet
                    </Link>
                </div>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
                        🚪 Logout
                    </button>
                    <button onClick={() => navigate('/psikologDashboard')} className="btn btn-secondary w-100">
                        ← Kthehu
                    </button>
                </div>
            </div>

            {/* Përmbajtja kryesore */}
            <div className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#f8f9fa" }}>
                <div className="container-fluid py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Menaxho Njoftimet</h2>
                        <button className="btn btn-primary" onClick={() => navigate('/add-notification')}>
                            + Dërgo Njoftim
                        </button>
                    </div>

                {loading ? (
                    <div className="loading">Po ngarkohet...</div>
                ) : (
                    <div className="table-container">
                        {notifications.length === 0 ? (
                            <p className="no-data">Nuk ka njoftime të dërguara.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Statusi</th>
                                        <th>Titulli</th>
                                        <th>Mesazhi</th>
                                        <th>Pacienti</th>
                                        <th>Data e Dërgimit</th>
                                        <th>Data e Leximit</th>
                                        <th>Veprime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification) => (
                                        <tr key={notification.notificationId}>
                                            <td>
                                                {notification.isRead ? (
                                                    <span className="badge badge-success">I lexuar</span>
                                                ) : (
                                                    <span className="badge badge-warning">I palexuar</span>
                                                )}
                                            </td>
                                            <td><strong>{notification.title}</strong></td>
                                            <td>{notification.message}</td>
                                            <td>{notification.patientName}</td>
                                            <td>{formatDate(notification.sentAt)}</td>
                                            <td>{formatDate(notification.readAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action btn-edit"
                                                        onClick={() => navigate(`/edit-notification/${notification.notificationId}`)}
                                                        title="Ndrysho"
                                                    >
                                                        Ndrysho
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => handleDelete(notification.notificationId)}
                                                        title="Fshij"
                                                    >
                                                        Fshij
                                                    </button>
                                                </div>
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

export default MenaxhoNotifications;
