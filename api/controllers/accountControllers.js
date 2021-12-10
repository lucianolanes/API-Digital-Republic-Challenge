const { StatusCodes } = require('http-status-codes');
const { createAcc, validateName, validateCPF } = require('../services/accountServices');

async function createNewAccount(req, res, next) {
  try {
    const { cpf, name } = req.body;
    validateName(name);
    await validateCPF(cpf);
    
    const verifyAndCreate = await createAcc(cpf, name);
    return res.status(StatusCodes.CREATED).json(verifyAndCreate);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewAccount,
}