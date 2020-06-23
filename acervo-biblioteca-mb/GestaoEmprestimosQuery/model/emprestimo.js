
const estados = ['inativo', 'ativo'];

const schema = {
  utente: String,
  dataInicio: Date,
  dataFim: Date,
  obra: String,
  estado: String
};

function create(utente, dataInicio, dataFim, obra) {

  const emprestimo = schema;

  emprestimo.utente = utente;

  emprestimo.dataInicio = dataInicio;

  emprestimo.dataFim = dataFim;

  emprestimo.obra = obra;

  emprestimo.estado = estados[1];

  return emprestimo;

}

function updateEstado(emprestimo) {

  emprestimo.estado = estados[0];

}

module.exports.create = create;
module.exports.updateEstado = updateEstado;