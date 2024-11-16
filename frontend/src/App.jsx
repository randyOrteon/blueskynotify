import React, { useEffect, useState } from 'react';
import './App.css';

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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="app">
            <h1>Notifications</h1>
            {Object.keys(notificationsData).map((username) => {
                // Filter out notifications with reason "follow" or "like"
                const notifications = (notificationsData[username] || []).filter(
                    (notification) => notification.reason !== 'follow' && notification.reason !== 'like'
                );

                return (
                    <div key={username} className="user-notifications">
                        <h2>{username}</h2>
                        {notifications.length === 0 ? (
                            <p>No relevant notifications</p>
                        ) : (
                            <ul className="notification-list">
                                {notifications.map((notification, index) => (
                                    <li key={index} className="notification-item">
                                        <div className="notification-author">
                                            <img
                                                src={notification.author?.avatar || 'placeholder.jpg'}
                                                alt={notification.author?.displayName || 'Author'}
                                                className="avatar"
                                            />
                                            <div className="author-details">
                                                <strong>{notification.author?.displayName}</strong>
                                                <p>{notification.author?.description}</p>
                                            </div>
                                        </div>
                                        <div className="notification-content">
                                            <p>{notification.record?.text}</p>
                                            <span className="notification-reason">
                                                Reason: {notification.reason}
                                            </span>
                                            <span className="notification-date">
                                                {new Date(notification.record?.createdAt).toLocaleString()}
                                            </span>
                                        </div>
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
