const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const BLUESKY_API_BASE = 'https://bsky.social';

// Hardcode credentials for multiple users
const users = [
    {
        username: "starbuckscoffee.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6M2twbG92MmtteWVtMm9jZTR5Y3RvNW90IiwiaWF0IjoxNzMxNjk4ODM4LCJleHAiOjE3MzE3MDYwMzgsImF1ZCI6ImRpZDp3ZWI6Z2Fub2Rlcm1hLnVzLXdlc3QuaG9zdC5ic2t5Lm5ldHdvcmsifQ.gHnSLtTK0hbFKI-o9sD8ItMaZ4wEUsU4Ndksz7BHaLi1umAtaeOh0OrUm4TS34vhiWv5fIJU2OAf_BZ4lG6o2Q"
    },
    {
        username: "dominospizzas.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6NXo2aGhjbXpvbWtubmZnaWd4eW92dzdpIiwiaWF0IjoxNzMxNjk4NzQ2LCJleHAiOjE3MzE3MDU5NDYsImF1ZCI6ImRpZDp3ZWI6cGFudGhlcmNhcC51cy1lYXN0Lmhvc3QuYnNreS5uZXR3b3JrIn0.wfqUpROfMe4avM0mnOEag-f_0eZUAfEYUvt1AIBou6OMV4gAiwxlg7FoasU-3DJz_DvUpY4MTSOCNmsU7PC24g" // Empty token will be populated later
    },
    {
        username: "home-depot.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6MjNscXplbTVrNW5iYTd2NnQ1c3JldWo1IiwiaWF0IjoxNzMxNzAxMTgxLCJleHAiOjE3MzE3MDgzODEsImF1ZCI6ImRpZDp3ZWI6c2NhcmxldGluYS51cy1lYXN0Lmhvc3QuYnNreS5uZXR3b3JrIn0.740xou4LHNAwsWJ-B290NNm5cOQuyXlbtbmiHR81O9rRpqUJM7UkidYASEfDkBzF7bPN0tLZx2LePi7KEi4rhw" // Empty token will be populated later
    }
];

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Function to get a new session token using username and password
async function getNewToken(username, password) {
    try {
        const response = await axios.post('https://bsky.social/api/login', {
            username: username,
            password: password,
        });
        return response.data.token;  // Assuming the token is returned in `response.data.token`
    } catch (error) {
        console.error('Error during login for', username, ':', error.message);
        throw new Error('Failed to get new token');
    }
}

// Function to fetch notifications using the current session token
async function fetchNotifications(sessionToken) {
    try {
        const response = await axios.get(`${BLUESKY_API_BASE}/xrpc/app.bsky.notification.listNotifications`, {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        
        // Check if the token expired and refresh it
        if (error.response && error.response.data.error === "ExpiredToken") {
            console.log('Token expired, refreshing token...');
            return null; // Indicate the need to refresh the token
        }

        throw new Error('Failed to fetch notifications');
    }
}

// Endpoint to fetch notifications for multiple users
app.get('/api/notifications', async (req, res) => {
    try {
        const notificationsForAllUsers = {};

        for (const user of users) {
            // If the user doesn't have a session token, get a new one
            if (!user.sessionToken) {
                user.sessionToken = await getNewToken(user.username, user.password);
            }

            // Fetch notifications for the user
            let notifications = await fetchNotifications(user.sessionToken);

            // If notifications failed due to expired token, refresh and retry
            if (!notifications) {
                user.sessionToken = await getNewToken(user.username, user.password);
                notifications = await fetchNotifications(user.sessionToken);
            }

            // Store the notifications for the user in the result object
            notificationsForAllUsers[user.username] = notifications || [];
        }

        // Return notifications for all users as JSON
        res.json(notificationsForAllUsers);
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({
            error: error.message || 'Failed to fetch notifications',
        });
    }
});

// Start the server and ensure a token is available
app.listen(PORT, async () => {
    try {
        // Ensure that all users have a session token when the server starts
        for (const user of users) {
            if (!user.sessionToken) {
                user.sessionToken = await getNewToken(user.username, user.password);
            }
        }
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
});
