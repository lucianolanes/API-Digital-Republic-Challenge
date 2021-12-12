const express = require('express');
const accountRouters = require('./api/routers/accountRouters');
const errorMiddleware = require('./api/middlewares/errorMiddleware');

const app = express();

app.use(express.json());

app.use('/account', accountRouters);

app.use(errorMiddleware);

module.exports = app;