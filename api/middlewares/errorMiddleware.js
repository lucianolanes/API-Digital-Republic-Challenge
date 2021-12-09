const validationException = require('../exceptions/validationException');
const { StatusCodes } = require('http-status-codes');

module.exports = (err, _req, res, _next) => {
  if (err instanceof validationException) {
    return res.status(err.code).json({ message: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
};