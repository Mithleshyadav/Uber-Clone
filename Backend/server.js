const http = require('http');
const path = require('path');
const express = require('express');
const app = require('./app');
const { initializeSocket } = require('./socket');

const PORT = process.env.PORT || 3000;
const __dirnameResolved = path.resolve();

// Create the HTTP server
const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);

// Serve frontend static files
app.use(express.static(path.join(__dirnameResolved, 'frontend', 'dist')));

// For any other route, send index.html (for React Router)
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirnameResolved, 'frontend', 'dist', 'index.html'));
});

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
