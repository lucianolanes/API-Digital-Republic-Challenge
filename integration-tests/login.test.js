const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const jwt = require('jsonwebtoken');
const { createNew, deleteAccount } = require('../api/models/accountModels');
require('dotenv').config();

chai.use(chaiHttp);

const { expect } = chai;

const SECRET = process.env.SECRET;

const name = 'Joana Paz';
const cpf = '03414223040';
const password = 'HUPQ10JQ';


describe('POST /account/login', () => {
  describe('quando login é realizado com sucesso', () => {
    let response = {};

    before(async () => {
      await createNew(cpf, name, password)
      response = await chai.request(server)
      .post('/account/login')
      .send({ cpf, password });
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

    it('o objeto possui a propriedade "token', () => {
      expect(response.body).to.have.property('token');
    });

    it('a propriedade token possui um token válido', () => {
        const { token } = response.body;
        const payload = jwt.verify(token, SECRET);
        expect(payload).to.have.property('name');
        expect(payload.name).to.be.equal(name);
        expect(payload).to.have.property('id');
    });
  });

  describe('quando a requisição contém um cpf inválido', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/login')
      .send({ cpf: '03414223045', password });
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
      .post('/account/login')
      .send({ cpf: '52478764075', password });
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('CPF ou senha incorretos.');
    });
  });

  describe('quando a requisição não contém o cpf', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/login')
      .send({ password });
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

  describe('quando a requisição contém uma senha incorreta', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/login')
      .send({ cpf, password: 'senhaSecreta' });
    });

    it('retorna o código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade message', () => { 
      expect(response.body).to.have.property('message');
    });

    it('a propriedade message possui o texto esperado', () => { 
      expect(response.body.message).to.be.equal('CPF ou senha incorretos.');
    });
  });

  describe('quando a requisição não contém a senha', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
      .post('/account/login')
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
      expect(response.body.message).to.be.equal('É necessário informar a senha.');
    });
  });
});