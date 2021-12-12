require('dotenv').config();
const app = require('./index.js');

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Conectado na porta ${PORT}`));