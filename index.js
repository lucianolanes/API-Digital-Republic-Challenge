const express = require('express');
const usersRouter = require('./api/routers/userRouters');
const errorMiddleware = require('./api/middlewares/errorMiddleware');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/user', usersRouter);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

module.exports = app;