const express = require('express');
const UserSchema = require('../schemas/userSchema');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

let router = express.Router();

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

module.exports = router;
