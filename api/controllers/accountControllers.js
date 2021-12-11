const { StatusCodes } = require('http-status-codes');
const { createAcc } = require('../services/accountServices');
const { cpfExists, validateName, validateCPF } = require('../services/validationServices');

async function createNewAccount(req, res, next) {
  try {
    const { cpf, name } = req.body;
    validateName(name);
    validateCPF(cpf);
    await cpfExists(cpf);
    
    const verifyAndCreate = await createAcc(cpf, name);
    return res.status(StatusCodes.CREATED).json(verifyAndCreate);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    validateCPF(cpf);

    return res.status(OK).json(validateLogin);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewAccount,
}