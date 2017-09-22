const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const UserSchema = require('./schemas/userSchema');
const simulacaoSchema = require('./schemas/simulacaoSchema');

const app = express();

mongoose.connect('mongodb://localhost/emprestimos');
app.use(bodyParser.json());

//rotas e futuros controladores
app.get('/', (req, res) => {
  res.send('Hello Word');
});
//salvar e listar os usuarios cadastrados no DB.
app.post('/cadastro', (req, res) => {
  let user = new UserSchema(req.body);
  user.senha = passwordHash.generate(req.body.senha);
  user.save((error, response) => {
    if(error){
      res.send(error, 404);
    };
    res.send(response, 201);
  });
});

app.get('/cadastro', (req, res) => {
  UserSchema.find((error, response) => {
    res.send(response, 200);
  });
});
//login - manda um post(via formulario) para acessar a sessao.
app.post('/login', (req, res) => {
  let query = {email : req.body.email};

  UserSchema.findOne(query, (error, usuario) => {
    if(usuario && passwordHash.verify(req.body.senha, usuario.senha)){
      const token = jwt.sign({_id: usuario._id}, 'money');
      res.set('Authorization', token);
      res.send(usuario, 200);
      return;
    };
    res.sendStatus(400);
  });

});
//middleware do expressJwt que protege as rotas abaixo com a verificacao do token ativo.
app.use(expressJwt({secret: 'money'}));
//simulacao de emprestimo
app.post('/simulacao', (req, res) => {
  UserSchema.findById(req.user._id, (error, usuario) => {
    console.log(usuario);
    let margem = usuario.renda * 0.3;
    let taxa = req.body.taxa / 100;
    let simulacao = req.body.valor * req.body.parcelas * taxa;

    if(req.body.valor <= margem ){
      res.send(`Na sua simulacao o valor de ${req.body.valor} fica ${simulacao} em ${req.body.parcelas} vezes a uma taxa de ${req.body.taxa}%`)
    }else {
      res.send('Valor fora da margem', 400)
    }
  });
});

app.post('/emprestimo', (req, res) => {
  UserSchema.findById(req.user._id, (error, usuario) => {
    let margem = usuario.renda * 0.3;
    let taxa = req.body.taxa / 100;
    let simulacao = req.body.valor * req.body.parcelas * taxa;
    let data = new Date;

    if(req.body.valor <= margem ){
      usuario.emprestimos = {
        valor: req.body.valor,
        parcelas: req.body.parcelas,
        taxa: `${taxa * 100}%`,
        data: `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
      };
      usuario.save(usuario);
      res.send(usuario);
    }else {
      res.send('Valor fora da margem', 400)
    }
  })
});

app.listen(3000, () => {
  console.log('Ouvindo na porta 3000.');
});
