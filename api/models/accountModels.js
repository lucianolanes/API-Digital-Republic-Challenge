const connection = require('./connection');

async function createNew(cpf, name, password) {
  return connection.execute(
    `INSERT INTO accounts (cpf, name, password) VALUES ('${cpf}', '${name}', '${password}');`
  );
}

async function findByCPF(cpf) {
  const result = await connection.execute(`SELECT * FROM accounts WHERE cpf = ${cpf};`);
  return result[0][0];
};

async function findByCredentials(cpf, password) {
  const result = await connection.execute(
    `SELECT * FROM accounts WHERE cpf = '${cpf}' AND password = '${password}';`
  );
  return result[0][0];
};

async function deposit(cpf, newAmount) {
 return connection.execute(
    `UPDATE accounts SET balance = '${newAmount}' WHERE cpf = '${cpf}';`
  );
};

module.exports = {
  createNew,
  deposit,
  findByCPF,
  findByCredentials,
};