const randomString = require('randomstring');
const { generateJWT } = require('./JWTServices');
const { StatusCodes } = require('http-status-codes');
const ValidationException = require('../exceptions/validationException');
const { 
  createNew,
  changeBalance,
  findByCPF,
  findByCredentials,
  findById,
} = require('../models/accountModels');

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
  return changeBalance(cpf, newAmount);
}

async function transferAmount(id, cpf, amount) {
  const destination = await findByCPF(cpf);
  if (!destination) throw new ValidationException('Conta inexistente', StatusCodes.NOT_FOUND);

  const { balance, cpf: originCPF } = await findById(id);
  if (amount > balance) throw new ValidationException('Saldo insuficiente', StatusCodes.BAD_REQUEST);
  
  const removeValue = Number(balance) - amount;
  await changeBalance(originCPF, removeValue);

  const addValue = amount + Number(destination.balance);
  await changeBalance(cpf, addValue);

};

module.exports = {
  accountLogin,
  createAcc,
  depositAmount,
  transferAmount,
}