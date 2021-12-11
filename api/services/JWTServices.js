const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

function generateJWT(id, name) {
  const CONFIG = {
    expiresIn: '20m',
    algorithm: 'HS256',
  };

  const PAYLOAD = { id, name };
  const token = jwt.sign(PAYLOAD, SECRET, CONFIG);

  return { token };
}

module.exports = {
  generateJWT,
};