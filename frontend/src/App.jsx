import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure to import the CSS file here

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/notifications');
                setNotifications(response.data.notifications || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchNotifications();
    }, []);

    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="notifications-container">
            <h1>Notifications</h1>
            <ul className="notification-list">
                {notifications.map((notification) => (
                    <li key={notification.cid} className="notification-item">
                        <img
                            src={notification.author.avatar}
                            alt="avatar"
                        />
                        <div className="notification-content">
                            <p className="author-name">{notification.author.displayName}</p>
                            <p className="reason">{notification.reason}</p>
                            {notification.post && (
                                <p className="post-content">{notification.post.text}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
