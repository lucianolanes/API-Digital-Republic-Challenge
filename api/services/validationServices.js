const { isCpf } = require('node-simple-validator');
const { findByCPF } = require('../models/accountModels');
const { StatusCodes } = require('http-status-codes');
const ValidationException = require('../exceptions/validationException');

async function cpfExists(cpf) {
  const exists = await findByCPF(cpf);
  
  if (exists) throw new ValidationException('CPF existente no banco de dados.', StatusCodes.CONFLICT);
}

function passwordExists(password) {
  if (!password) throw new ValidationException('É necessário informar a senha.', StatusCodes.BAD_REQUEST);
}

function validateCPF(cpf) {
  if (!cpf) throw new ValidationException('É necessário informar o CPF.', StatusCodes.BAD_REQUEST);

  const isValid = isCpf(cpf);
  if (!isValid) throw new ValidationException('CPF inválido.', StatusCodes.BAD_REQUEST);
}

function validateName(name) {
  if (!name) throw new ValidationException('É necessário informar o nome.', StatusCodes.BAD_REQUEST);
}

function validateAmount(amount) {
  if (!amount) throw new ValidationException('É necessário informar o valor.', StatusCodes.BAD_REQUEST);

  if (amount <= 0) throw new ValidationException('Valor inválido.', StatusCodes.BAD_REQUEST);
}

function validateMaxAmount(amount) {
  const maxValue = 2000;
  if (amount > maxValue) throw new ValidationException('Valor excede o máximo', StatusCodes.BAD_REQUEST);
}

module.exports = {
  cpfExists,
  validateAmount,
  validateCPF,
  validateMaxAmount,
  validateName,
  passwordExists,
}