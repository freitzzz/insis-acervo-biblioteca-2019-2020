
const schema = {
  primeiroNome: String,
  ultimoNome: String,
  estatuto: Number,
  dataHoraFinalSuspensao: Date,
  permissoesEspeciais: Boolean
};

function create(primeiroNome, ultimoNome) {

  const utente = schema;

  utente.primeiroNome = primeiroNome;

  utente.ultimoNome = ultimoNome;

  utente.estatuto = 2.5;

  utente.dataHoraFinalSuspensao = undefined;

  return utente;

}

function hasPermissionsToReporEstadoUtente(utente) {

  return utente.permissoesEspeciais;

}

module.exports.create = create;
module.exports.hasPermissionsToReporEstadoUtente = hasPermissionsToReporEstadoUtente;