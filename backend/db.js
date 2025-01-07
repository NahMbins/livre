const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/livre';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  console.log('MongoDB connection established');
});
