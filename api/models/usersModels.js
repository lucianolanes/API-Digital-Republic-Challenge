const connection = require('./connection');


async function createNewUser(cpf, name, password) {
  return connection.execute(
    `INSERT INTO users (cpf, name, password) VALUES ('${cpf}', '${name}', '${password}');`
  );
}

async function findByCPF(cpf) {
  const result = await connection.execute(`SELECT * FROM users WHERE cpf = ${cpf};`);
  return result[0][0];
};

module.exports = {
  createNewUser,
  findByCPF,
};