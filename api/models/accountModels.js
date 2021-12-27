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

async function changeBalance(cpf, newAmount) {
 return connection.execute(
    `UPDATE accounts SET balance = '${newAmount}' WHERE cpf = '${cpf}';`
  );
};

async function findById(id) {
  const result = await connection.execute(`SELECT * FROM accounts WHERE id = ${id};`);
  return result[0][0];
};

async function deleteAccount(cpf) {
  const result = await connection.execute(`DELETE FROM accounts WHERE cpf = '${cpf}';`);
  return result[0][0];
};

async function transfer(cpfOrigin, balanceOrigin, cpfDest, balanceDest) {
  try {
    await connection.query('START TRANSACTION');
    await connection.query(`UPDATE accounts SET balance = '${balanceOrigin}' WHERE cpf = '${cpfOrigin}'`);
    await connection.query(`UPDATE accounts SET balance = '${balanceDest}' WHERE cpf = '${cpfDest}'`);
    await connection.query('COMMIT');
  } catch(error) {
    await connection.query('ROLLBACK');
    throw error;
  }
}


module.exports = {
  transfer,
  changeBalance,
  createNew,
  deleteAccount,
  findByCPF,
  findByCredentials,
  findById,
};