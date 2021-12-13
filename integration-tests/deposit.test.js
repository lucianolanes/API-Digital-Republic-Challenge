const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const { createNew, findByCPF, deleteAccount} = require('../api/models/accountModels');
require('dotenv').config();

chai.use(chaiHttp);

const { expect } = chai;

const name = 'Joana Paz';
const cpf = '03414223040';
const password = 'HUPQ10JQ';
const amount = 300;


describe('POST /account/deposit', () => {
  describe('quando o depósito é realizado com sucesso', () => {
    let response = {};

    before(async () => {
      await createNew(cpf, name, password)
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf, amount });
  });

    after(async () => {
      await deleteAccount(cpf);
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
      expect(response.body.message).to.be.equal('Valor depositado com sucesso.');
    });

    it('o valor foi alterado corretamente na conta', async () => {
      const { balance } = await findByCPF(cpf);
      expect(balance).to.be.equal('300.00');
    });
  });

  describe('quando o depósito é realizado com sucesso', () => {
    let response = {};

    before(async () => {
      await createNew(cpf, name, password)
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf, amount });
  });

    after(async () => {
      await deleteAccount(cpf);
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
      expect(response.body.message).to.be.equal('Valor depositado com sucesso.');
    });

    it('o valor foi alterado corretamente na conta', async () => {
      const { balance } = await findByCPF(cpf);
      expect(balance).to.be.equal('300.00');
    });
  });

  describe('quando a requisição contém um cpf inválido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf: '03414223045', amount });
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

  describe('quando a requisição contém um cpf não vinculado a nenhuma conta', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf: '91426685068', amount });
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

  describe('quando a requisição não contém o valor a ser depositado', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf });
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
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf, amount: -300 });
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

  describe('quando a requisição contém um valor acima de R$ 2000,00', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/deposit')
      .send({ cpf, amount: 2001.00 });
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
      expect(response.body.message).to.be.equal('Valor excede o máximo.');
    });
  });
});