const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

module.exports = app;