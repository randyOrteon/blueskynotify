import React, { useEffect, useState } from 'react';
import './App.css'; // You can add custom styles here for better UX/UI

const App = () => {
    const [notificationsData, setNotificationsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notifications from the backend
    useEffect(() => {
        async function fetchNotifications() {
            try {
                const response = await fetch('http://localhost:3000/api/notifications');
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }
                const data = await response.json();
                setNotificationsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="app">
            <h1>Notifications</h1>
            {Object.keys(notificationsData).map((username) => {
                const notifications = notificationsData[username]?.notifications || [];
                return (
                    <div key={username} className="user-notifications">
                        <h2>{username}</h2>
                        {notifications.length === 0 ? (
                            <p>No notifications</p>
                        ) : (
                            <ul>
                                {notifications.map((notification) => (
                                    <li key={notification.cid} className="notification-item">
                                        <div className="notification-author">
                                            <img
                                                src={notification.author.avatar}
                                                alt={notification.author.displayName}
                                                className="avatar"
                                            />
                                            <div>
                                                <strong>{notification.author.displayName}</strong>
                                                <p>{notification.author.description}</p>
                                            </div>
                                        </div>
                                        <p>{notification.record.text}</p>
                                        <p><em>Reason: {notification.reason}</em></p>
                                        <span>{new Date(notification.record.createdAt).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default App;
