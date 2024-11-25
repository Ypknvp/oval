const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB connection
mongoose.connect('mongodb+srv://yogeshp:yogeshp@cluster0.0six4.mongodb.net/userdetails?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define a schema for user data (Bio-data form)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

// Create a model for the user
const User = mongoose.model('User', userSchema);

// POST route to handle form submission (for saving new data)
app.post('/submit', (req, res) => {
  // Ensure _id is not sent in the request payload
  const { _id, ...userData } = req.body; // This removes the _id if it's included

  const newUser = new User(userData);

  // Log the received data to check
  console.log('Received data:', userData);

  // Save the new user data to MongoDB
  newUser.save()
    .then(() => {
      res.status(200).json({ message: 'Data saved successfully!' });
    })
    .catch(err => {
      console.error('Error saving data:', err);
      res.status(400).json({ error: 'Error saving data', details: err.message });
    });
});

// GET route to fetch all user data
app.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(400).json({ error: 'Error fetching users' });
    });
});

// PUT route to update user data
app.put('/user/:id', (req, res) => {
  console.log('Updating user data:', req.body);

  // Use findByIdAndUpdate to update the user data
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully!', user });
    })
    .catch(err => {
      console.error('Error updating user:', err);
      res.status(400).json({ error: 'Error updating user', details: err.message });
    });
});

// DELETE route to delete a user
app.delete('/user/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'User deleted successfully!' });
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      res.status(400).json({ error: 'Error deleting user', details: err.message });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
