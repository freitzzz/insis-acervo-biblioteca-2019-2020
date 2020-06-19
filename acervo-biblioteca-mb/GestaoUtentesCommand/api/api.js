const Utente = require('../model/utente.js');


// TODO: What to do in error cases ?

// TODO: Wrap common behavior in function to reduce duplicated code

function onReporEstadoRecebido(eventstore, idUtente, idBibliotecarioMor, valorEstatuto, publishCallback, response) {

  console.log(`onReporEstadoRecebido called with $idUtente: ${idUtente}, $idBibliotecarioMor: ${idBibliotecarioMor}, $valorEstatuto: ${valorEstatuto}`);

  eventstore.getNewId(function (idError, newId) {

    if (idError) {
      console.error(`Failed to get new stream id due to: ${idError}`);
    } else {
      console.log(`Got new stream id: ${newId}`);

      eventstore.getEventStream(newId, function (errorGetEventStream, stream) {

        if (errorGetEventStream) {

          console.log(`Failed to get new stream due to: ${errorGetEventStream}`);

        } else {

          console.log('Got event stream');

          stream.addEvent({ repor_estado_recebido: 'repor_estado_recebido' });

          stream.commit(function (errorStreamCommit, stream) {

            if (errorStreamCommit) {

              console.log(`Failed to commit`);

            } else {

              console.log(`Commit with success the following events: ${stream.eventsToDispatch}`);

              publishCallback('repor_estado_recebido', {
                id_utente: idUtente,
                id_bibliotecario_mor: idBibliotecarioMor,
                valor_estatuto: valorEstatuto,
                id_stream: newId
              });

              response.status(202).send({ url: `/commands/${newId}` });

            }

          });

        }

      });
    }

  });

}

function onReporEstadoUtenteNaoEncontrado(eventstore, idUtente, idStream) {

  console.log(`onReporEstadoUtenteNaoEncontrado called with $idUtente: ${idUtente}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_utente_nao_encontrado: idUtente });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

    }

  });

}

function onReporEstadoBibliotecarioMorNaoEncontrado(eventstore, idBibliotecarioMor, idStream) {

  console.log(`onReporEstadoBibliotecarioMorNaoEncontrado called with $idBibliotecarioMor: ${idBibliotecarioMor}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_bibliotecario_mor_nao_encontrado: idBibliotecarioMor });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

    }

  });

}

function onReporEstadoNaoAutorizado(eventstore, idBibliotecarioMor, idStream) {

  console.log(`onReporEstadoNaoAutorizado called with $idBibliotecarioMor: ${idBibliotecarioMor}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_nao_autorizado: idBibliotecarioMor });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

    }

  });

}

function onReporEstadoAutorizado(eventstore, utente, valorEstatuto, idStream, publishCallback) {

  console.log(`onReporEstadoAutorizado called with $utente: ${utente}, $valorEstatuto: ${valorEstatuto}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_autorizado: 'repor_estado_autorizado' });

      const isUtenteInativo = Utente.isUtenteInativo(utente);

      if (isUtenteInativo) {

        const isEstatutoValueEnoughToReporEstado = Utente.isEstatutoValueEnoughToReporEstado(valorEstatuto);

        if (isEstatutoValueEnoughToReporEstado) {

          publishCallback('repor_estado_aceite', {
            id_utente: utente.id,
            valor_estatuto: valorEstatuto
          });

        } else {

          console.error('estatuto value is not enough to update utente');

          stream.addEvent({ repor_estado_autorizado: 'repor_estado_estatuto_value_not_enough' });

        }

      } else {

        console.error('utente is not in estado inativo');

        stream.addEvent({ repor_estado_autorizado: 'repor_estado_estatuto_utente_not_inativo' });

      }

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added events');
        }

      });

    }

  });

}

function onReporEstadoRealizado(eventstore, idUtente, idStream) {

  console.log(`onReporEstadoRealizado called with $idUtente: ${idUtente}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_realizado: idUtente });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

    }

  });

}

function onReporEstadoNaoRealizado(eventstore, razao, idStream) {

  console.log(`onReporEstadoNaoRealizado called with $razao: ${razao}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ repor_estado_nao_realizado: razao });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

    }

  });

}


exports.onReporEstadoRecebido = onReporEstadoRecebido;
exports.onReporEstadoAutorizado = onReporEstadoAutorizado;
exports.onReporEstadoBibliotecarioMorNaoEncontrado = onReporEstadoBibliotecarioMorNaoEncontrado;
exports.onReporEstadoNaoAutorizado = onReporEstadoNaoAutorizado;
exports.onReporEstadoNaoRealizado = onReporEstadoNaoRealizado;
exports.onReporEstadoRealizado = onReporEstadoRealizado;
exports.onReporEstadoRecebido = onReporEstadoRecebido;
exports.onReporEstadoUtenteNaoEncontrado = onReporEstadoUtenteNaoEncontrado;