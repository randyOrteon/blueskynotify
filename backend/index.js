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
    },
    {
        username: "victorias-secret.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6cmYyeDVnZzRqM3VicWljMjdrZ3pod2Y1IiwiaWF0IjoxNzMxNzAyMDMzLCJleHAiOjE3MzE3MDkyMzMsImF1ZCI6ImRpZDp3ZWI6cmVpc2hpLnVzLWVhc3QuaG9zdC5ic2t5Lm5ldHdvcmsifQ.uXGz36m4w9IuVWpw6xHgQdfr6oQF-zi66GxfqSv1--Vjxs3PhSgKySnKfsqPokkiLUzN2FKyu9iLZnAdGsBW9Q" // Empty token will be populated later
    },{
        username: "pix11news.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6cGk2ZG1ydWtrcWFna2U1eW93aDdoYm53IiwiaWF0IjoxNzMxNzAyMjA0LCJleHAiOjE3MzE3MDk0MDQsImF1ZCI6ImRpZDp3ZWI6bWVhZG93LnVzLWVhc3QuaG9zdC5ic2t5Lm5ldHdvcmsifQ.yrwMZKoymJKKjpQpq00H4XNZf0WXpYmasRRvsXGgByzquzCLxb0ngBqBy8ha2jCCkYBBkv-Yb7D5HcmeztjxOQ" // Empty token will be populated later
    },{
        username: "ben-n-jerrys.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6dTVoYnJ3dmhsZjJkYWozNXg1MnhpdWVhIiwiaWF0IjoxNzMxNzAyMzQ3LCJleHAiOjE3MzE3MDk1NDcsImF1ZCI6ImRpZDp3ZWI6aGVsdmVsbGEudXMtZWFzdC5ob3N0LmJza3kubmV0d29yayJ9.3huLVKvnQuaZOLH92IV9U15Ann3NT9SemGa3LMSsdv_uDNFptM129U1_M-b0prPful8rGZyKGQIt-BGdsedpiw" // Empty token will be populated later
    },{
        username: "delta-air-lines.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6eDI0bzdmcGxubm11dDRhM3A0ZHhvdG14IiwiaWF0IjoxNzMxNzAyNjAzLCJleHAiOjE3MzE3MDk4MDMsImF1ZCI6ImRpZDp3ZWI6d2l0Y2hlc2J1dHRlci51cy13ZXN0Lmhvc3QuYnNreS5uZXR3b3JrIn0.mWTiYiV8XxyWDVxry9RLP5kxUedlwp6beedclu9H37q6I3Icm5cW12HjsXZu31SQ3YakZHpao2U_keoLEEAqkA" // Empty token will be populated later
    },{
        username: "time-magazine.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6c2xydGlxNXZqN2l5cTN4NHN3NXd1YTJoIiwiaWF0IjoxNzMxNzAyNzcyLCJleHAiOjE3MzE3MDk5NzIsImF1ZCI6ImRpZDp3ZWI6cGFyYXNvbC51cy1lYXN0Lmhvc3QuYnNreS5uZXR3b3JrIn0.99XtBk1NS8gs8g8TA9-UddeHTNyfSVh4kgIH0DDGoQ9ooLUSlcu_4mEt4cToYiYd5a_GSKLDMD7H8DE1YffzRA" // Empty token will be populated later
    },{
        username: "buzzfeeds-news.bsky.social",
        password: "parassareen1",
        sessionToken: "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6aXVmNTdsNHo1bWk0cGlsanV1Y3d1empoIiwiaWF0IjoxNzMxNzAyODk2LCJleHAiOjE3MzE3MTAwOTYsImF1ZCI6ImRpZDp3ZWI6Z2Fub2Rlcm1hLnVzLXdlc3QuaG9zdC5ic2t5Lm5ldHdvcmsifQ.L7-f8gNtVIUI7TyowlISNjqb9kmjXKGsoD8E6nUAnXZTRoA10cZRfUi4pQwrMWV3-KO8Hz5LZpG1SxjiOVwgAQ" // Empty token will be populated later
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
