//acessando o express e middlewares.
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//controladores
const emprestimoController = require('./controllers/emprestimo');
const simulacaoController = require('./controllers/simulacao');
const cadastroController = require('./controllers/cadastro');
const loginController = require('./controllers/login');
//iniciando a aplicacao
const app = express();
//conectando com o banco de dados DB.
mongoose.connect('mongodb://localhost/emprestimos');
//middleware bodyParser -> extrai da req infos em JSON.
app.use(bodyParser.json());
//aplicacao acessando os caminhos e passando os controladores.
app.use('/emprestimo', emprestimoController);
app.use('/simulacao', simulacaoController);
app.use('/cadastro', cadastroController);
app.use('/login', loginController);
//Hello Word!
app.get('/', (req, res) => {
  res.send('Hello Word');
});
//ouvindo o servidor na porta 3000.
app.listen(3000, () => {
  console.log('Ouvindo na porta 3000.');
});
