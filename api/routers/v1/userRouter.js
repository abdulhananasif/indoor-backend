const express = require('express');

const bodyParser = require('body-parser');

const {register, login} = require('../../utils/v1/user');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter
  .route('/register')
  .all((req, res, next) => {
    res.status(200).setHeader('Content-Type', 'application/json');
    next();
  })
  .post((req, res, next) => {
    try {
      register(req.body, res);
    } catch (err) {
      res.status(500).send({message: 'Internal Server Error!'});
    }
  });

userRouter
  .route('/login')
  .all((req, res, next) => {
    res.status(200).setHeader('Content-Type', 'application/json');
    next();
  })
  .post((req, res, next) => {
    try {
      login(req.body, res);
    } catch (err) {
      res.status(500).send({message: 'Internal Server Error!'});
    }
  });

module.exports = userRouter;
