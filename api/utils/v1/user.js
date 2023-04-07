const Joi = require('joi');

const bcrypt = require('bcrypt');

const _ = require('lodash');

const User = require('../../../mongodb/models/user');

const saltRounds = 10;

const register = async (userInfo, res) => {
  let response = {};
  const schema = Joi.object({
    username: Joi.string().min(3).max(15).required().messages({
      'string.base': 'Username must be a string!',
      'string.min': 'Username length must be at least 3 characters long!',
      'string.max':
        'Username length must be less than or equal to 15 characters long!',
      'any.required': 'Username is a required!',
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string!',
      'string.email': 'Email must be a valid email!',
      'any.required': 'Email is a required!',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is not allowed to be empty!',
      'any.required': 'Password is a required!',
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required('Confirm password is required!')
      .messages({'any.only': 'Passwords do not match'}),
    name: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Name must be a string!',
      'string.min': 'Name length must be at least 3 characters long!',
      'string.max':
        'Name length must be less than or equal to 30 characters long!',
      'any.required': 'Name is a required!',
    }),
  });
  try {
    const userData = await schema.validateAsync(userInfo);
    const user = await User.findOne({
      email: userInfo.email,
    });
    if (user) {
      throw {
        message: 'This email is already registered in our system!',
      };
    } else {
      const user = await User.findOne({
        username: userInfo.username,
      });
      if (user) {
        throw {
          message: 'This username is already taken!',
        };
      } else {
        const hashedPassword = bcrypt.hashSync(userInfo.password, saltRounds);
        const user = new User({
          name: userInfo.name,
          username: userInfo.username,
          password: hashedPassword,
          email: userInfo.email,
          passwordResetCode: '',
        });
        try {
          await user.save();
          delete userData.password;
          response.data = {
            success: true,
            message: 'User registered successfully!',
          };
          response.status = 200;
        } catch (err) {
          throw {
            message: 'User registration failed!',
          };
        }
      }
    }
  } catch (err) {
    let errorMessage = '';
    if (err.details) {
      err.details.map((err) => (errorMessage += err.message));
    } else {
      errorMessage += err.message;
    }
    response.status = 400;
    response.data = {
      success: false,
      error: errorMessage,
    };
  }
  return res.status(response.status).send(response.data);
};

const login = async (userInfo, res) => {
  let response = {};
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string!',
      'string.email': 'Email must be a valid email!',
      'any.required': 'Email is a required!',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is not allowed to be empty!',
      'any.required': 'Password is a required!',
    }),
  });
  try {
    await schema.validateAsync(userInfo);
    const user = await User.findOne({
      email: userInfo.email,
    });
    if (user) {
      const isPasswordMatched = await bcrypt
        .compare(userInfo.password, user.password)
        .then((result) => {
          return result;
        });
      if (isPasswordMatched) {
        const userToSend = {};
        userToSend.name = user.name;
        userToSend.email = user.email;
        userToSend.username = user.username;
        userToSend._id = user._id;
        response.status = 200;
        response.data = {
          success: true,
          message: 'Login successful!',
          userInfo: userToSend,
        };
      } else {
        throw {message: 'Invalid password!'};
      }
    } else {
      throw {message: 'User is not registered!'};
    }
  } catch (err) {
    let errorMessage = '';
    if (err.details) {
      err.details.map((err) => (errorMessage += err.message));
    } else {
      errorMessage += err.message;
    }
    response.status = 400;
    response.data = {
      success: false,
      error: errorMessage,
    };
  }
  return res.status(response.status).send(response.data);
};

module.exports = {register, login};
