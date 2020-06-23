
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

// Validates if the utente can reservar ou pedir emprestimo
function hasPermissionsToRequire(utente, estado) {
  if(utente.estatuto > 3 && estado == 3){
    return true;
  }
  if(utente.estatuto > 4 && estado < 3){
    return true;
  }
  return false;
}

module.exports.create = create;
module.exports.hasPermissionsToReporEstadoUtente = hasPermissionsToReporEstadoUtente;
module.exports.hasPermissionsToRequire = hasPermissionsToRequire;