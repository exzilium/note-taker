const express = require('express');

// Import our modular routers for notes and any future routes as needed
const notesRouter = require('./notes');

const app = express();

// Notes
app.use('/notes', notesRouter);


// export
module.exports = app;
