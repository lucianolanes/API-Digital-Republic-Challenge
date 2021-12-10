const express = require('express');
const accountRouters = require('./api/routers/accountRouters');
const errorMiddleware = require('./api/middlewares/errorMiddleware');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/account', accountRouters);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

module.exports = app;