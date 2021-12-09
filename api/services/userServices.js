const { isCpf } = require('node-simple-validator');
const ValidationException = require('../exceptions/validationException');
const { StatusCodes } = require('http-status-codes');
const { createNewUser } = require('../models/usersModels');

function validateName(name) {
  if (!name) throw new ValidationException('É necessário informar o nome.', StatusCodes.BAD_REQUEST);
}

function validateCPF(cpf) {
  if (!cpf) throw new ValidationException('É necessário informar o CPF.', StatusCodes.BAD_REQUEST);

  const isValid = isCpf(cpf);
  if (!isValid) throw new ValidationException('CPF inválido.', StatusCodes.BAD_REQUEST);
}

async function createUser(cpf, name) {
  return await createNewUser(cpf, name);
}

module.exports = {
  createUser,
  validateCPF,
  validateName,
}