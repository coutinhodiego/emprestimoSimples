//acessando o express, middlewares e schemas.
const express = require('express');
const UserSchema = require('../schemas/userSchema');
const passwordHash = require('password-hash');
const expressJwt = require('express-jwt');
//ativa Router();
let router = express.Router();
//verifica o token ativo
router.use(expressJwt({secret: 'money'}));
//salva novo usuario, onde somente o Admin -> adm. pode salvar
router.post('/', (req, res) => {
  UserSchema.findById(req.user._id, (error, usuario) =>{
    if (usuario.adm){
      let user = new UserSchema(req.body);
      user.senha = passwordHash.generate(req.body.senha);
      user.save((error, response) => {
        if(error){
          res.send(error, 404);
        };
        res.send(response, 201);
      });
    }else{
      res.send('Apenas o Admin pode salvar novos usuarios', 400);
    };
  });
});
//lista os usuarios cadastrados
router.get('/', (req, res) => {
  UserSchema.find((error, response) => {
    res.send(response, 200);
  });
});
// remove um usuario cadastrado atravez do parametro id /cadastro/id
router.get('/:id', (req, res) => {
    UserSchema.findByIdAndRemove(req.params.id, (error, usuario) => {
      console.log(error);
    });
    res.redirect('/cadastro');
});
//exporta como um modulo o router.
module.exports = router;
