require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BLUESKY_API_BASE = 'https://bsky.social';

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Placeholder for session token
let sessionToken = "eyJ0eXAiOiJhdCtqd3QiLCJhbGciOiJFUzI1NksifQ.eyJzY29wZSI6ImNvbS5hdHByb3RvLmFjY2VzcyIsInN1YiI6ImRpZDpwbGM6M2twbG92MmtteWVtMm9jZTR5Y3RvNW90IiwiaWF0IjoxNzMxNjg1OTc1LCJleHAiOjE3MzE2OTMxNzUsImF1ZCI6ImRpZDp3ZWI6Z2Fub2Rlcm1hLnVzLXdlc3QuaG9zdC5ic2t5Lm5ldHdvcmsifQ.tvMAYoMeMtwgH8EPuWl60rXUGW0K-bwAgduUROaO45XUbX1jcKjc3jtkJxqWSzqWCn4_kf4aJ8VN1AjXQEVwXA";

// Route to fetch notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const response = await axios.get('https://bsky.social/xrpc/app.bsky.notification.listNotifications', {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
        });
        res.json(response.data); // Return the API response as JSON
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch notifications',
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`);
});
