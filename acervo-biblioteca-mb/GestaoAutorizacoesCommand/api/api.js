const Utente = require('../model/utente.js');

const axios = require('axios');

const Estado = require('../model/estado');

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
      getUtente = getUtente.data;
      getObraInPolos(esbHost, obra).then(function (obrasExistentes) {
        console.log(obrasExistentes)
        if (obrasExistentes == undefined || obrasExistentes.length == 0) {
          console.log("Sending reserva_obra_nao_encontrada");
          publishCallback('reserva_obra_nao_encontrada', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            id_stream: idStream
          });
        } else {
          var obrasAutorizadas = getObrasUtenteAutorizado(getUtente, obrasExistentes);
          if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
            console.log("Sending reserva_utente_autorizado");
            publishCallback('reserva_utente_autorizado', {
              utente: utente,
              dataInicio: dataInicio,
              dataFim: dataFim,
              obra: obra,
              obrasAutorizadas: obrasAutorizadas,
              id_stream: idStream
            });
          } else {
            console.log("Sending reserva_utente_nao_autorizado");
            publishCallback('reserva_utente_nao_autorizado', {
              utente: utente,
              dataInicio: dataInicio,
              dataFim: dataFim,
              obra: obra,
              id_stream: idStream
            });
          }
        }
      })

    })
    .catch(function (errorGetUtente) {
      console.log(errorGetUtente);
      if (errorGetUtente.response.status == 404) {

        publishCallback('reserva_recebida_utente_nao_encontrado', {
          id_utente: utente,
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
      getUtente = getUtente.data;
      var obrasExistentes = getObraInPolos(esbHost, obra);
      if (obrasExistentes == undefined || obrasExistentes.length == 0) {
        publishCallback('emprestimo_obra_nao_encontrada', {
          utente: utente,
          dataInicio: dataInicio,
          dataFim: dataFim,
          obra: obra,
          id_stream: idStream
        });
      } else {
        var obrasAutorizadas = getObrasUtenteAutorizado(getUtente, obrasExistentes);
        if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
          publishCallback('emprestimo_utente_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            obrasAutorizadas: obrasAutorizadas,
            id_stream: idStream
          });
        } else {
          publishCallback('emprestimo_utente_nao_autorizado', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obra,
            id_stream: idStream
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


  var polos = getPolos(esbHost);

  const obrasPorPolo = polos.map((polo) => axios.default.get(`${esbHost}/acervobiblioteca/polos/${polo}/obras/${obra}`))
  
  return axios.default.all(obrasPorPolo).then(function (responses) {
    const obras = [];

    responses.forEach(function (getObraPolo, index) {
      
      getObraPolo = getObraPolo.data;
      
      if (getObraPolo.count != getObraPolo.states.length) {
        getObraPolo.states = [getObraPolo.states.reduceRight((p, c) => c + p)];
      }
      
      getObraPolo.states.forEach(state => {
        var obra = {
          titulo: getObraPolo.title,
          estado: Estado.getValue(state), //convert string to int
          polo: polos[index]
        }
        obras.push(obra);
      });
    });

    return obras;
  });
}

function getPolos(esbHost) {

  console.log(`getPolos`);

  return ["polo2", "polo3"];
  // axios
  //   .default
  //   .get(`${esbHost}/acervobiblioteca/polos`)
  //   .then(function (getPolos) {

  //     var polos = new Array()

  //     getPolos.forEach(element => {
  //       polos.push(element.name)
  //     });

  //     return polos;
  //   })
  //   .catch(function (errorGetPolos) {

  //     console.log(`getPolos error : ${errorGetPolos}`);

  //     return [];
  //   });
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