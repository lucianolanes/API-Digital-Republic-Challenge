const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const { deleteAccount } = require('../api/models/accountModels');

chai.use(chaiHttp);

const { expect } = chai;

const name = 'Joana Paz';
const cpf = '03414223040';

describe('POST /account/create', () => {
  describe('quando é criado com sucesso', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/create')
      .send({ cpf, name });
  });

    after(async () => {
      await deleteAccount(cpf);
    });


    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui as propriedades "cpf", "name" e "password"', () => {
      expect(response.body).to.have.property('cpf');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('password');
    });

    it('a propriedade "cpf" possui o cpf do usuário que criou a conta', () => {
        expect(response.body.cpf).to.be.equal(cpf);
    });

    it('a propriedade "name" possui o nome do usuário que criou a conta', () => {
        expect(response.body.name).to.be.equal(name);
    });

    it('a propriedade "password" possui 8 caracteres', () => {
      expect(response.body.password).to.have.length(8);
    });
  });

  describe('quando a requisição não contém o cpf', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/create')
      .send({ name });
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
      response = await chai.request(server)
      .post('/account/create')
      .send({ cpf: '03414223045', name });
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

  describe('quando a requisição não contém o nome', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/create')
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
      expect(response.body.message).to.be.equal('É necessário informar o nome.');
    });
  }); 
});