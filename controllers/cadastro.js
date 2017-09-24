const express = require('express');
const UserSchema = require('../schemas/userSchema');
const passwordHash = require('password-hash');

let router = express.Router();


router.post('/', (req, res) => {
  let user = new UserSchema(req.body);
  user.senha = passwordHash.generate(req.body.senha);
  user.save((error, response) => {
    if(error){
      res.send(error, 404);
    };
    res.send(response, 201);
  });
});

router.get('/', (req, res) => {
  UserSchema.find((error, response) => {
    res.send(response, 200);
  });
});

module.exports = router;
