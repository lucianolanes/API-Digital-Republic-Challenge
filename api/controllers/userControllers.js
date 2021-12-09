const { StatusCodes } = require('http-status-codes');
const { createUser, validateName, validateCPF } = require('../services/userServices');

async function createNewUser(req, res, next) {
  try {
    const { cpf, name } = req.body;
    validateName(name)
    validateCPF(cpf)

    const verifyAndCreate = await createUser(cpf, name);
    return res.status(StatusCodes.CREATED).json(verifyAndCreate);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewUser,
}