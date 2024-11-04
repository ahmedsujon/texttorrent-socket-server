const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // You can replace "*" with specific domains if needed
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Use CORS middleware for Express
// Route to display "Server is running" message
app.get('/', (req, res) => {
    res.send('Server is running');
});

let users = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (username) => {
        users[socket.id] = username; // Store username with socket ID
        console.log(`${username} joined the chat`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        delete users[socket.id]; // Clean up when user disconnects
    });
});

// API endpoint to send a message to all users
app.post('/send_message', (req, res) => {
    const {
        message,
        content
    } = req.body;
    io.emit('receive_message', {
        content: content
    });
    res.status(200).json({
        status: 'Message sent'
    });
});

server.listen(3000, () => {
    console.log('Socket.io server running on port 3000');
});
