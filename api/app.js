require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const v1 = require('./apiVersions/v1');

const app = express();
app.use(express.json({limit: '99999999999mb'}));
app.use(cors({}));
app.use(bodyParser.urlencoded({extended: true}));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to mongo dB...'))
  .catch((err) => console.log("Couldn't connect to mongo dB...", err));

v1.prepareV1Routes(app);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

module.exports = app;
