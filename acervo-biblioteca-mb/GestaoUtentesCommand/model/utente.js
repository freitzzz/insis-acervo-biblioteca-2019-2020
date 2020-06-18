
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


function isUtenteInativo(utente) {

  const utenteEstado = estado(utente);

  return utenteEstado === estados[0];

}

function isEstatutoValueEnoughToReporEstado(estatuto) {

  return estatuto >= 2;

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


module.exports.isEstatutoValueEnoughToReporEstado = isEstatutoValueEnoughToReporEstado;
module.exports.isUtenteInativo = isUtenteInativo;
module.exports.create = create;
module.exports.estado = estado;