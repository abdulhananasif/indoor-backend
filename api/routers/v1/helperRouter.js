const express = require('express');
const bodyParser = require('body-parser');

const helpersRouter = express.Router();
helpersRouter.use(bodyParser.json());

helpersRouter
  .route('/')
  .all((req, res, next) => {
    res.status(200).setHeader('Content-Type', 'application/json');
    next();
  })
  .get((req, res, next) => {
    res.status(404).send({message: 'This end point is not supported'});
  })
  .post((req, res, next) => {
    res.status(404).send({message: 'This end point is not supported'});
  });

module.exports = helpersRouter;
