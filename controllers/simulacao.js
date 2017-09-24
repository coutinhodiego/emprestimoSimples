//acessando o express, middlewares e schemas.
const express = require('express');
const expressJwt = require('express-jwt');
const UserSchema = require('../schemas/userSchema');
//ativa Router()
let router = express.Router();
//verifica o token ativo.
router.use(expressJwt({secret: 'money'}));
//simulacao de emprestimo.
router.post('/', (req, res) => {
  UserSchema.findById(req.user._id, (error, usuario) => {
    let margem = usuario.renda * 0.3;
    let taxa = req.body.taxa / 100;
    let simulacao = req.body.valor * req.body.parcelas * taxa;

    if(req.body.valor <= margem ){
      res.send(`Simulacao de ${req.body.valor} reais em ${req.body.parcelas} vezes a uma taxa de ${req.body.taxa}%`)
    }else {
      res.send('Valor fora da margem', 400)
    }
  });
});
//exporta como um modulo router.
module.exports = router;
