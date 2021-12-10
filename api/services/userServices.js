const { isCpf } = require('node-simple-validator');
const randomString = require('randomstring');
const ValidationException = require('../exceptions/validationException');
const { StatusCodes } = require('http-status-codes');
const { createNewUser, findByCPF } = require('../models/usersModels');

function validateName(name) {
  if (!name) throw new ValidationException('É necessário informar o nome.', StatusCodes.BAD_REQUEST);
}

async function validateCPF(cpf) {
  if (!cpf) throw new ValidationException('É necessário informar o CPF.', StatusCodes.BAD_REQUEST);

  const isValid = isCpf(cpf);
  if (!isValid) throw new ValidationException('CPF inválido.', StatusCodes.BAD_REQUEST);

  const exists = await findByCPF(cpf);
  
  if (exists) throw new ValidationException('CPF existente no banco de dados.', StatusCodes.CONFLICT);
}

async function createUser(cpf, name) {
  const password = randomString.generate({
    length: 8,
    capitalization: 'uppercase'
  });

  await createNewUser(cpf, name, password);
  
  return { cpf, name, password };
}

module.exports = {
  createUser,
  validateCPF,
  validateName,
}