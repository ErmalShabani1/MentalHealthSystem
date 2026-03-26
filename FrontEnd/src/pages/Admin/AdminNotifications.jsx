import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllNotifications, deleteNotification } from '../../services/NotificationService';
import '../../styles/auth.css';

function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getAllNotifications();
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

    const handleLogout = () => {
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/adminDashboard');
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <div
                className="bg-dark text-white p-3 d-flex flex-column"
                style={{ 
                    width: "240px", 
                    position: "fixed", 
                    height: "100vh",
                    overflowY: "auto"
                }}
            >
                <div className="mb-2">
                    <Link to="/adminDashboard" className="nav-link text-white px-2 py-1 mb-1" style={{fontSize: '0.85rem'}}>
                        🏠 Dashboard
                    </Link>
                </div>

                <div className="mb-2">
                    <div className="text-white mb-1 px-1 py-1">
                        <small className="text-uppercase fw-semibold" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>🔔 Njoftimet</small>
                    </div>
                    <Link to="/admin-notifications" className="nav-link text-white px-2 py-1 mb-1 active" style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', fontSize: '0.8rem'}}>
                        📋 Menaxho Njoftimet
                    </Link>
                </div>

                <div className="mt-auto pt-3 border-top">
                    <button onClick={handleLogout} className="btn btn-danger w-100 mb-2">
                        🚪 Logout
                    </button>
                    <button onClick={handleBack} className="btn btn-secondary w-100">
                        ← Kthehu
                    </button>
                </div>
            </div>

            <div className="flex-grow-1" style={{ marginLeft: "240px", backgroundColor: "#f8f9fa", overflowY: "auto", minHeight: "100vh" }}>
                <div className="container-fluid py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Të Gjitha Njoftimet</h2>
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
                                        <th>ID</th>
                                        <th>Statusi</th>
                                        <th>Titulli</th>
                                        <th>Mesazhi</th>
                                        <th>Psikologu</th>
                                        <th>Pacienti</th>
                                        <th>Data e Dërgimit</th>
                                        <th>Data e Leximit</th>
                                        <th>Veprime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification) => (
                                        <tr key={notification.notificationId}>
                                            <td>{notification.notificationId}</td>
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
                                            <td>{notification.patientName}</td>
                                            <td>{formatDate(notification.sentAt)}</td>
                                            <td>{formatDate(notification.readAt)}</td>
                                            <td>
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDelete(notification.notificationId)}
                                                >
                                                    Fshij
                                                </button>
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

export default AdminNotifications;
