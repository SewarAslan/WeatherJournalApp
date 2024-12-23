// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express app instance
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable cross-origin requests
app.use(express.static('website')); // Serve static files from the 'website' folder

// Initialize the project data object
let projectData = {};

// GET route to send project data
app.get('/all', (req, res) => {
    console.log('Sending projectData to client:', projectData); // Debugging line
    res.send(projectData);
  });

// POST route to receive and store data
app.post('/add', (req, res) => {
    const { temperature, date, userResponse } = req.body;
    projectData = { temperature, date, userResponse };
    console.log('Server received data:', projectData); // Debugging line
    res.send({ message: 'Data saved successfully' });
  });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
