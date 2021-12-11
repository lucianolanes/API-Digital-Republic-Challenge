const { isCpf } = require('node-simple-validator');
const { findByCPF } = require('../models/accountModels');
const { StatusCodes } = require('http-status-codes');
const ValidationException = require('../exceptions/validationException');

function validateName(name) {
  if (!name) throw new ValidationException('É necessário informar o nome.', StatusCodes.BAD_REQUEST);
}

function validateCPF(cpf) {
  if (!cpf) throw new ValidationException('É necessário informar o CPF.', StatusCodes.BAD_REQUEST);

  const isValid = isCpf(cpf);
  if (!isValid) throw new ValidationException('CPF inválido.', StatusCodes.BAD_REQUEST);
}

async function cpfExists(cpf) {
  const exists = await findByCPF(cpf);
  
  if (exists) throw new ValidationException('CPF existente no banco de dados.', StatusCodes.CONFLICT);
}

module.exports = {
  cpfExists,
  validateCPF,
  validateName,
}