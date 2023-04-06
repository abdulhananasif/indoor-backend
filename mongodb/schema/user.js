const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  picture: String,
  passwordResetCode: String,
});

module.exports = userSchema;
