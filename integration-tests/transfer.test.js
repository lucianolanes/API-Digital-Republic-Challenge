const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const { createNew, deleteAccount} = require('../api/models/accountModels');
require('dotenv').config();

chai.use(chaiHttp);

const { expect } = chai;

const accounts = [
  {
    name:'Joana Paz',
    cpf: '01574888021',
    password: 'HUPQ12JQ',
    amount: 300,
  },
  {
    name:'José Paz',
    cpf: '41324512083',
    password: 'HUPQ10JQ',
  },
];

const acc0 = accounts[0];
const acc1 = accounts[1];

describe('PUT /account/transfer', () => {
  describe('quando a transferência é realizada com sucesso', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);
      await createNew(acc1.cpf, acc1.name, acc1.password);
     
      await chai.request(server)
      .post('/account/deposit')
      .send({ cpf: acc0.cpf, amount: acc0.amount });

      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: acc1.cpf, amount: acc0.amount });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
      await deleteAccount(acc1.cpf);
    });


    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('Valor transferido com sucesso.');
    });
  });

  describe('quando o token não é enviado no header da requisição', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .put('/account/transfer')
      .send({ cpf: acc1.cpf, amount: acc0.amount });
  });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('Token ausente.');
    });
  });

  describe('quando o token enviado no header da requisição é inválido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', 'eyJhbGciOiJIUzI1N')
      .send({ cpf: acc1.cpf, amount: acc0.amount });
  });

    it('retorna o código de status 500', () => {
      expect(response).to.have.status(500);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  describe('quando a requisição não contém um cpf', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);
     
      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ amount: acc0.amount });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('É necessário informar o CPF.');
    });
  });

  describe('quando a requisição contém um cpf inválido', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);
     
      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: '01574888022', amount: acc0.amount });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('CPF inválido.');
    });
  });

  describe('quando a requisição não contém o valor a ser transferido', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);
     
      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: acc0.cpf });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('É necessário informar o valor.');
    });
  });

  describe('quando a requisição contém um valor negativo', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);
     
      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: acc0.cpf, amount: -200 });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('Valor inválido.');
    });
  });

  describe('quando a requisição contém um valor maior do que o saldo do usuário', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);

      await chai.request(server)
      .post('/account/deposit')
      .send({ cpf: acc0.cpf, amount: 200 });
     
      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: acc0.cpf, amount: acc0.amount });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('Saldo insuficiente.');
    });
  });

  describe('quando o cpf informado na requisição não está vinculado a nenhuma conta', () => {
    let response = {};

    before(async () => {
      await createNew(acc0.cpf, acc0.name, acc0.password);

      const { body: { token } } = await chai.request(server)
      .post('/account/login')
      .send({ cpf: acc0.cpf, password: acc0.password });

      response = await chai.request(server)
      .put('/account/transfer')
      .set('authorization', token)
      .send({ cpf: '72883821097', amount: acc0.amount });
  });

    after(async () => {
      await deleteAccount(acc0.cpf);
    });

    it('retorna o código de status 404', () => {
      expect(response).to.have.status(404);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('Conta inexistente.');
    });
  });
});