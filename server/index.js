require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');

// Connect to MongoDB
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/capital-one-app';
console.log('Attempting to connect to MongoDB...');
console.log('URI used:', uri.includes('mongodb+srv') ? 'Atlas Cluster (Hidden)' : 'Localhost');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000 // Fail after 5 seconds if server not found
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Details:', err);
    console.error('Connection URI was:', uri.includes('mongodb+srv') ? 'Atlas Cluster' : 'Localhost');
  });

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

app.get('/', (req, res) => {
  res.send('Capital One Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
