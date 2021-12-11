const randomString = require('randomstring');
const { generateJWT } = require('./JWTServices');
const { StatusCodes } = require('http-status-codes');
const ValidationException = require('../exceptions/validationException');
const { createNew, deposit, findByCPF, findByCredentials } = require('../models/accountModels');

async function createAcc(cpf, name) {
  const password = randomString.generate({
    length: 8,
    capitalization: 'uppercase'
  });

  await createNew(cpf, name, password);
  
  return { cpf, name, password };
}

async function accountLogin(cpf, password) {
  const result = await findByCredentials(cpf, password.toUpperCase());
  if (!result) throw new ValidationException('CPF ou senha incorretos.', StatusCodes.UNAUTHORIZED);

  return generateJWT(result.id, result.name);
}

async function depositAmount(cpf, amount) {
  const account = await findByCPF(cpf);
  if (!account) throw new ValidationException('Conta inexistente', StatusCodes.NOT_FOUND);

  const { balance } = account;
  const newAmount = amount + Number(balance);
  return deposit(cpf, newAmount);
}

module.exports = {
  accountLogin,
  createAcc,
  depositAmount,
}