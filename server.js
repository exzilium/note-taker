const express = require('express');
const path = require('path');
const api = require('./routes/index');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and URLencoded forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route
app.use('/api', api); 

// HTML routes
app.use(express.static('public')); 

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// // Wildcard route to direct users to a 404 page
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/404.html'))
// );

// LISTEN
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);