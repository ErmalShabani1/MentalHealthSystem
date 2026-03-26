import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getMyNotifications,
    markNotificationAsRead,
    getUnreadCount,
} from "../../services/NotificationService";
import "../../styles/auth.css";
import PatientSidePanel from "./PatientSidePanel";

function MyNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

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
            toast.error("Gabim në ngarkim e njoftimeve");
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
            console.error("Error fetching unread count:", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            toast.success("Njoftimi u shënua si i lexuar");
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            toast.error("Gabim në shënimin e njoftimit");
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("sq-AL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <PatientSidePanel
                section="notifications"
                activePath="/my-notifications"
                linkBadges={{ "/my-notifications": unreadCount }}
            />

            <div
                className="flex-grow-1"
                style={{
                    marginLeft: "240px",
                    backgroundColor: "#f8f9fa",
                    overflowY: "auto",
                    minHeight: "100vh",
                }}
            >
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
                                                className={notification.isRead ? "" : "unread-notification"}
                                            >
                                                <td>
                                                    {notification.isRead ? (
                                                        <span className="badge badge-success">I lexuar</span>
                                                    ) : (
                                                        <span className="badge badge-warning">I palexuar</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <strong>{notification.title}</strong>
                                                </td>
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
