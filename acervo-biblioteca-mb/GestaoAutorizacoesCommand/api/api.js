const Utente = require('../model/utente.js');

const axios = require('axios');

const getValue = require('../model/estado');

// TODO: What to do in error cases ?

// TODO: Wrap common behavior in function to reduce duplicated code

function onReporEstadoRecebido(guQueryHost, idUtente, idBibliotecarioMor, valorEstatuto, idStream, publishCallback) {

  console.log(`onReporEstadoRecebido called with $idUtente: ${idUtente}, $idBibliotecarioMor: ${idBibliotecarioMor}, $valorEstatuto: ${valorEstatuto}, $idStream: ${idStream}`);

  axios
    .default
    .get(`${guQueryHost}/utentes/${idUtente}`)
    .then(function (getUtente) {

      const utente = getUtente.data;

      axios
        .default
        .get(`${guQueryHost}/utentes/${idBibliotecarioMor}`)
        .then(function (getBibliotecarioMor) {

          const bibliotecarioMor = getBibliotecarioMor.data;

          const hasPermissionsToReporEstadoUtente = Utente.hasPermissionsToReporEstadoUtente(bibliotecarioMor);

          if (hasPermissionsToReporEstadoUtente) {

            publishCallback('repor_estado_autorizado', {
              utente: utente,
              valor_estatuto: valorEstatuto,
              id_stream: idStream
            });

          } else {

            publishCallback('repor_estado_nao_autorizado', {
              id_bibliotecario_mor: bibliotecarioMor.id,
              id_stream: idStream
            });

          }

        })
        .catch(function (errorGetBibliotecarioMor) {

          if (errorGetBibliotecarioMor.response.status == 404) {

            publishCallback('repor_estado_bibliotecario_mor_nao_encontrado', {
              id_bibliotecario_mor: idBibliotecarioMor,
              id_stream: idStream
            });

          }

        });

    })
    .catch(function (errorGetUtente) {

      if (errorGetUtente.response.status == 404) {

        publishCallback('repor_estado_utente_nao_encontrado', {
          id_utente: idUtente,
          id_stream: idStream
        });

      }

    });
}

function onReservaRecebida(guQueryHost, esbHost, utente, obra, dataInicio, dataFim, idStream, publishCallback) {
  console.log(`onReservaRecebida called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  axios
    .default
    .get(`${guQueryHost}/utentes/${utente}`)
    .then(function (getUtente) {
      var obrasExistentes = getObraInPolos(esbHost, obra);
      if (obrasExistentes == undefined || obrasExistentes.length == 0) {
        publishCallback('reserva_recebida_obra_nao_encontrada', {
          utente: utente,
          dataInicio: dataInicio,
          dataFim: dataFim,
          obra: obra,
          streamId: idStream
        });
      } else {
        var obrasAutorizadas = getObrasUtenteAutorizado(getUtente, obrasExistentes);
        if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
          publishCallback('utente_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            obrasAutorizadas: obrasAutorizadas,
            streamId: idStream
          });
        } else {
          publishCallback('utente_nao_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            streamId: idStream
          });
        }
      }
    })
    .catch(function (errorGetUtente) {

      if (errorGetUtente.response.status == 404) {

        publishCallback('reserva_recebida_utente_nao_encontrado', {
          id_utente: idUtente,
          id_stream: idStream
        });

      }

    });
}

function onEmprestimoRecebido(guQueryHost, esbHost, utente, obra, dataInicio, dataFim, idStream, publishCallback) {
  console.log(`onEmprestimoRecebido called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  axios
    .default
    .get(`${guQueryHost}/utentes/${utente}`)
    .then(function (getUtente) {
      var obrasExistentes = getObraInPolos(esbHost, obra);
      if (obrasExistentes == undefined || obrasExistentes.length == 0) {
        publishCallback('emprestimo_recebido_obra_nao_encontrada', {
          utente: utente,
          dataInicio: dataInicio,
          dataFim: dataFim,
          obra: obra,
          streamId: idStream
        });
      } else {
        var obrasAutorizadas = getObrasUtenteAutorizado(getUtente, obrasExistentes);
        if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
          publishCallback('utente_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            obrasAutorizadas: obrasAutorizadas,
            streamId: idStream
          });
        } else {
          publishCallback('utente_nao_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            streamId: idStream
          });
        }
      }
    })
    .catch(function (errorGetUtente) {

      if (errorGetUtente.response.status == 404) {

        publishCallback('emprestimo_recebido_utente_nao_encontrado', {
          id_utente: idUtente,
          id_stream: idStream
        });

      }

    });
}

function getObraInPolos(esbHost, obra) {

  console.log(`getObraInPolos called with $obra: ${obra}`);

  var obras = new Array()

  var polos = getPolos(esbHost);

  polos.forEach(polo => {
    axios
      .default
      .get(`${esbHost}/acervobiblioteca/polos/${polo}/obras/${obra}`)
      .then(function (getObraPolo) {

        getObraPolo.states.forEach(estado => {
          var obra = {
            titulo: obra,
            estado: getValue(estado), //convert string to int
            polo: polo
          }
          obras.push(obra);
        });

      })
      .catch(function (errorGetObraPolo) {

        console.log(`getObraInPolos error : ${errorGetObraPolo}`);

      });
  });

  return obras;

}

function getPolos(esbHost) {

  console.log(`getPolos`);

  axios
    .default
    .get(`${esbHost}/acervobiblioteca/polos`)
    .then(function (getPolos) {

      var polos = new Array()

      getPolos.forEach(element => {
        polos.push(element.name)
      });

      return polos;
    })
    .catch(function (errorGetPolos) {

      console.log(`getPolos error : ${errorGetPolos}`);

      return [];
    });
}

function getObrasUtenteAutorizado(utente, obrasExistentes) {
  var obrasAutorizadas = [];
  obrasExistentes.forEach(obra => {
    if (Utente.hasPermissionsToRequire(utente, obra.estado)) {
      obrasAutorizadas.push(obra);
    }
  });
  return obrasAutorizadas;
}

exports.onReporEstadoRecebido = onReporEstadoRecebido;
exports.onReservaRecebida = onReservaRecebida;
exports.onEmprestimoRecebido = onEmprestimoRecebido;