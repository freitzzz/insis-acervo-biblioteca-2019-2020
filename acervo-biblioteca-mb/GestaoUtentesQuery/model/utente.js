const estados = ['inativo', 'suspenso', 'ativo'];

const schema = {
  primeiroNome: String,
  ultimoNome: String,
  estatuto: Number,
  dataHoraFinalSuspensao: Date
};

function create(primeiroNome, ultimoNome) {

  const utente = schema;

  utente.primeiroNome = primeiroNome;

  utente.ultimoNome = ultimoNome;

  utente.estatuto = 2.5;

  utente.dataHoraFinalSuspensao = undefined;

  return utente;

}

function updateEstatuto(utente, newEstatuto) {

  let dataHoraFinalSuspensao = utente.dataHoraFinalSuspensao;

  if (newEstatuto > 6) {

    newEstatuto = 6;

    dataHoraFinalSuspensao = undefined;

  } else if (newEstatuto < 1) {
    newEstatuto = 0.99;

    dataHoraFinalSuspensao = undefined;

  } else if (newEstatuto < 2) {

    dataHoraFinalSuspensao = new Date();

    dataHoraFinalSuspensao.setMonth(dataHoraFinalSuspensao.getMonth() + 2);

  }

  utente.estatuto = newEstatuto;
  utente.dataHoraFinalSuspensao = dataHoraFinalSuspensao;

}

function estado(utente) {

  const estatuto = utente.estatuto;

  const dataHoraFinalSuspensao = utente.dataHoraFinalSuspensao;

  if (estatuto < 1) {
    return estados[0];
  } else if (estatuto < 2 && dataHoraFinalSuspensao > new Date()) {
    return estados[1];
  } else {
    return estados[2];
  }

}

module.exports.create = create;

module.exports.updateEstatuto = updateEstatuto;

module.exports.estado = estado;

module.exports.schema = schema;