//acessando o express, middlewares e schemas.
const express = require('express');
const UserSchema = require('../schemas/userSchema');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
//ativa Router()
let router = express.Router();
//efetua o login.
router.post('/', (req, res) => {
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
//exporta como um modulo o router.
module.exports = router;
