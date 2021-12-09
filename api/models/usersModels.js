const connection = require('./connection');


async function createNewUser(cpf, name) {
  return connection.execute(
    `INSERT INTO users (cpf, name) VALUES ('${cpf}', '${name}');`
  );
}

module.exports = {
  createNewUser,
};