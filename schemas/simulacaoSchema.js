//acessa o mongoose
const mongoose = require('mongoose');
//cria uma const schema
const simulacaoSchema = mongoose.model('simulacao',{
  valor: {type: String, required: true},
  parcelas: {type: String, required: true}
});
//exporta como um modulo simulacaoSchema.
module.exports = simulacaoSchema;
