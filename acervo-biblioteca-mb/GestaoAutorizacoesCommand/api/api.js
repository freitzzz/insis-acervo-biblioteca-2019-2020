const Utente = require('../model/utente.js');

const axios = require('axios');


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


exports.onReporEstadoRecebido = onReporEstadoRecebido;