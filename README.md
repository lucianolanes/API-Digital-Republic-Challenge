Este projeto é uma API REST simulando o gerenciamento de contas bancárias, realizada para o [Desafio de Back](https://github.com/devdigitalrepublic/donus-code-challenge/blob/master/backend.md) End proposto pela Digital Republic.

## Ferramentas utilizadas
- Node.js
- Express.js
- Banco de Dados: MySQL
- JTW
- Mocha
- Chai

## Preparando o ambiente

- Após clonar e acessar o diretório do projeto, é necessário instalar as dependências com o comando `npm install`.

- Faça uma cópia do arquivo `.env.example`, criando um arquivo `.env` com a porta a ser utilizada, as suas credenciais SQL e um segredo da sua escolha para ser utilizado na criação e validação do JWT;

- Para restaurar o banco de dados: copie todo o conteúdo do arquivo [digitalBank.sql](digitalBank.sql) que se encontra na raiz do projeto, cole no seu Workbench e execute a query. Verifique se foi criado o banco com a tabela vazia 'accounts'. Se não, restaure o banco novamente.

- Para conectar a API e ser possível utilizar os endpoints, no seu terminal execute o comando `npm start`.

- Para rodar os testes utilize o comando `npm test`.

## Estrutura
A API foi estruturada no padrão REST, portanto possui sua organização bem definida com Models, Services, Controllers e Middlewares em suas respectivas pastas, onde: 
  - Controller: lida com as requisições, retornado a resposta esperada ou enviando para o middleware de erro;
  - Service: valida as informações enviadas na requisição e permissões;
  - Model: acessa o banco de dados;
  - Middleware: trata os erros e as exceções.

## Endpoints
Todos os endpoints por padrão necessitam de um objeto JSON no body da requisição e retornam outro objeto do mesmo formato como resposta. Já para o endpoint que necessita autenticação, além do JSON enviado no body também é necessário o envio do JWT (JSON Web Token) no campo `authorization` pelo header.

Caso haja algum erro ou envio de informações inválidas, sempre será retornada uma mensagem explicativa junto com seu status HTTP referente.

#### `POST /account/create` - cadastra uma nova conta;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato:

```json
{
  "cpf": "52478764075",
  "name": "Maria Silva"
}
```

**Atenção:** Se as informações enviadas forem válidas e conta for criada com sucesso, será retornado o status HTTP `201` com os dados da conta criada juntamente com a senha necessária para login.

```json
{
    "cpf": "52478764075",
    "name": "Maria Silva",
    "password": "QFBCHVYE"
}
```
<hr>

#### `POST /account/deposit` - deposita um valor para uma conta;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato:

```json
{
  "cpf": "52478764075",
  "amount": 300.00
}
```

Se as informações enviadas estiverem corretas, forem válidas e o valor não ultrapassar o limite máximo de 2000, será retornado o status HTTP `200` com a seguinte mensagem:

```json
{
    "message": "Valor depositado com sucesso."
}
```
<hr>

#### `POST /account/login` - autentica as informações do cliente e gera um token JWT;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato, utilizando o CPF vinculado à conta juntamente com a senha recebida no cadastro:

```json
{
  "cpf": "52478764075",
  "password": "QFBCHVYE"
}
```

**Atenção:** Se as informações enviadas estiverem corretas, será retornado o status HTTP `200` com o token gerado (token válido por 20 min):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cC...."
}
```

#### `PUT /account/transfer` - realiza uma transferência da conta bancária do cliente para outra;
Deverá ser enviado no body da requisição um objeto JSON no seguinte formato, utilizando o CPF vinculado à conta a ser tranferida, juntamente com o valor.
**Atenção:** Também deverá ser enviado pelo header da requisição, no campo `authorization` o token gerado ao fazer login.

```json
{
  "cpf": "52478764075",
  "amount": 300.00
}
```
Se o CPF da conta destino estiver correto, o valor não for negativo e o cliente tiver o saldo equivalente na sua conta, será retornado o status HTTP `200` com a seguinte mensagem:

```json
{
  "message": "Valor transferido com sucesso.",
}
```