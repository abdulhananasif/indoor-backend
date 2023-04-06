module.exports.prepareV1Routes = (app) => {
  const prefix = '/api/v1/';

  const helpersRouter = require('../routers/v1/helperRouter');

  app.use(`${prefix}helper`, helpersRouter);
};
