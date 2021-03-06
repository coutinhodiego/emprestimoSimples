//acessando o express, middlewares e schemas.
const express = require('express');
const expressJwt = require('express-jwt');
const UserSchema = require('../schemas/userSchema');
//ativa Router();
let router = express.Router();
//verifica o token ativo
router.use(expressJwt({secret: 'money'}));
//realiza o emprestimo
router.post('/', (req, res) => {
  UserSchema.findById(req.user._id, (error, usuario) => {
    let margem = usuario.renda * 0.3;
    let taxa = req.body.taxa / 100;
    let simulacao = req.body.valor * req.body.parcelas * taxa;
    let data = new Date;

    if(req.body.valor <= margem ){
      let novoEmprestimo = {
        valor: req.body.valor,
        parcelas: req.body.parcelas,
        taxa: `${taxa * 100}%`,
        data: `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
      };
      usuario.emprestimos.addToSet(novoEmprestimo);
      usuario.save(usuario);
      res.send(usuario);
    }else {
      res.send('Valor fora da margem', 400)
    }
  })
});
//exporta como um modulo o router.
module.exports = router;
