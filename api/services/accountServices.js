const randomString = require('randomstring');
const { createNew } = require('../models/accountModels');


async function createAcc(cpf, name) {
  const password = randomString.generate({
    length: 8,
    capitalization: 'uppercase'
  });

  await createNew(cpf, name, password);
  
  return { cpf, name, password };
}

module.exports = {
  createAcc,
}