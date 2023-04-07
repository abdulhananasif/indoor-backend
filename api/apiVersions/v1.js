module.exports.prepareV1Routes = (app) => {
  const prefix = '/api/v1/';

  const helpersRouter = require('../routers/v1/helperRouter');
  const userRouter = require('../routers/v1/userRouter');

  app.use(`${prefix}helper`, helpersRouter);
  app.use(`${prefix}user`, userRouter);
};
