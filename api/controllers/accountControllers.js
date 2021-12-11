const { StatusCodes } = require('http-status-codes');
const { createAcc, accountLogin } = require('../services/accountServices');
const { cpfExists, passwordExists, validateName, validateCPF } = require('../services/validationServices');

async function createNewAccount(req, res, next) {
  try {
    const { cpf, name } = req.body;
    validateName(name);
    validateCPF(cpf);
    await cpfExists(cpf);
    
    const result = await createAcc(cpf, name);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { cpf, password } = req.body;
    validateCPF(cpf);
    passwordExists(password);
    const result = await accountLogin(cpf, password);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewAccount,
  login
}