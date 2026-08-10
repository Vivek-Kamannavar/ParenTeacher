// MERN Admission Server Entry Point - Active
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const admissionRoutes = require('./routes/admissionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admissions', admissionRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Admission System API is running' });
});

// Database Connection
const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parenteacher';
mongoose.set('bufferCommands', false);
mongoose
  .connect(dbUri)
  .then(() => {
    console.log('MongoDB successfully connected.');
    // Start Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Ensure MongoDB service is running locally, or configure MONGO_URI in .env.');
    
    // In dev mode, we can start server anyway so UI still loads and shows error notifications
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} without MongoDB connection (Fallback mode)`);
    });
  });
