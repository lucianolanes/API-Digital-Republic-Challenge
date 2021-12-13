Este projeto é uma API REST simulando o gerenciamento de contas bancárias, realizada para o [Desafio de Back](https://github.com/devdigitalrepublic/donus-code-challenge/blob/master/backend.md) End proposto pela Digital Republic.

## Ferramentas utilizadas
- Node.js
- Express.js
- Banco de Dados: MySQL
- JTW
- Mocha
- Chai

## Preparando o ambiente

Após clonar e acessar o diretório do projeto, é necessário instalar as dependências com o comando `npm i`.

- Faça uma cópia do arquivo `.env.example`, criando um arquivo `.env` com a porta a ser utilizada, as suas credenciais SQL e um segredo da sua escolha para ser utilizado na criação e validação do JWT;

- Para restaurar o banco de dados: copie todo o conteúdo do arquivo [digitalBank](digitalBank.sql) que se encontra na raiz do projeto, cole no seu Workbench e execute a query. Verifique foi criado o banco com a tabela vazia 'accounts'. Se não, restaure o banco novamente.

- Para conectar a API e ser possível utilizar os endpoints, no seu terminal execute o comando `npm start`.

- Para rodar os testes utilize o comando `npm test`.

## Estrutura
A API foi estruturada no padrão REST, portanto possui organização bem definida com Models, Services, Controllers, Routers e Middleares em suas respectivas pastas.

## Endpoints
Todos os endpoints por padrão necessitam de um objeto JSON no body da requisição e retornam outro objeto do mesmo formato como resposta. Já para o endpoint que necessita autenticação, além do JSON enviado no body também é necessário o envio do JWT (JSON Web Token) no campo `authorization` pelo header.

Caso haja algum erro ou envio de informações inválidas, sempre será retornada uma mensagem junto com o status http referente.

#### `POST /account/create` - cadastra uma nova conta;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato:

```json
{
  "cpf": "52478764075",
  "name": "Maria Silva"
}
```

**Atenção:** Se a conta for criada com sucesso, será retornado o status http `201` com os dados da conta criada juntamente com a senha necessária para login.

```json
{
    "cpf": "52478764075",
    "name": "Maria Silva",
    "password": "QFBCHVYE"
}
```

#### `POST /account/deposit` - deposita um valor para a conta;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato:

```json
{
  "cpf": "52478764075",
  "amount": 300.00
}
```

Se as informações enviadas estiverem corretas, será retornado o status http `200` com a seguinte mensagem:

```json
{
    "message": "Valor depositado com sucesso."
}
```