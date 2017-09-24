const mongoose = require('mongoose');

const simulacaoSchema = mongoose.model('simulacao',{
  valor: {type: String, required: true},
  parcelas: {type: String, required: true}
});

module.exports = simulacaoSchema;
