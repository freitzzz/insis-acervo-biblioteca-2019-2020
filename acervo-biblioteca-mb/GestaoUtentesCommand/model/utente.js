
const estados = ['inativo', 'suspenso', 'ativo'];


function isUtenteInativo(utente) {

  const utenteEstado = estado(utente);

  return utenteEstado == estados[0];

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