const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Create a URL schema and model
const urlSchema = new mongoose.Schema({
    shortUrl: String,
    originalUrl: String,
  });
  
  const Url = mongoose.model('Url', urlSchema, 'urls'); // Specify collection name 'urls'
  
  // Event listener for MongoDB connection
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  // Event listener for MongoDB connection error
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = { Url, mongoose };
