const { StatusCodes } = require('http-status-codes');
const { validateJWT } = require('../services/JWTServices');
const { accountLogin, createAcc, depositAmount, transferAmount } = require('../services/accountServices');
const {
  cpfExists,
  passwordExists,
  validateAmount,
  validateCPF,
  validateMaxAmount,
  validateName,
} = require('../services/validationServices');

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

async function deposit(req, res, next) {
  try {
    const { cpf, amount } = req.body;

    validateCPF(cpf);
    validateAmount(Number(amount));
    validateMaxAmount(Number(amount));
    await depositAmount(cpf, Number(amount));

    return res.status(StatusCodes.OK).json({ message: 'Valor depositado com sucesso.'});
  } catch (err) {
    next(err);
  }
}

async function transfer(req, res, next) {
  try {
    const token = validateJWT(req.headers.authorization);
    const { cpf, amount } = req.body;

    validateCPF(cpf);
    validateAmount(Number(amount));
    await transferAmount(token.id, cpf, Number(amount));

    return res.status(StatusCodes.OK).json({ message: 'Valor transferido com sucesso.'});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewAccount,
  deposit,
  login,
  transfer,
}