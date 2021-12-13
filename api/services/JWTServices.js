const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ValidationException = require('../exceptions/validationException');
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

function validateJWT(token) {
  if (!token) throw new ValidationException('Token ausente.', StatusCodes.UNAUTHORIZED);
  const payload = jwt.verify(token, SECRET);
  return payload;
}


module.exports = {
  generateJWT,
  validateJWT,
};