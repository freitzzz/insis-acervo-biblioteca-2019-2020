const Utente = require('../model/utente.js');

const eventstore = require('eventstore')();

// TODO: What to do in error cases ?

// TODO: Maybe URL can be composed by stream id?

// TODO: Wrap common behavior in function to reduce duplicated code

function onReporEstadoRecebido(idUtente, idBibliotecarioMor, valorEstatuto, publishCallback, response) {

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

          stream.addEvent({ my: 'repor_estado_recebido' });

          stream.commit(function (errorStreamCommit, stream) {

            if (errorStreamCommit) {

              console.log(`Failed to commit`);

            } else {

              console.log(`Commit with success the following events: ${stream.eventsToDispatch}`);

              publishCallback('report_estado_recebido', {
                id_utente: idUtente,
                id_bibliotecario_mor: idBibliotecarioMor,
                valor_estatuto: valorEstatuto
              });

              // TODO: URL

              response.status(202).send();

            }

          });

        }

      });
    }

  });

}

function onReporEstadoUtenteNaoEncontrado(idUtente, idStream) {

  console.log(`onReporEstadoUtenteNaoEncontrado called with $idUtente: ${idUtente}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_utente_nao_encontrado' });

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

function onReporEstadoBibliotecarioMorNaoEncontrado(idBibliotecarioMor, idStream) {

  console.log(`onReporEstadoBibliotecarioMorNaoEncontrado called with $idBibliotecarioMor: ${idBibliotecarioMor}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_bibliotecario_mor_nao_encontrado' });

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

function onReporEstadoNaoAutorizado(bibliotecarioMor, idStream) {

  console.log(`onReporEstadoNaoAutorizado called with $bibliotecarioMor: ${bibliotecarioMor}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_nao_autorizado' });

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

function onReporEstadoAutorizado(utente, valorEstatuto, idStream, publishCallback) {

  console.log(`onReporEstadoAutorizado called with $utente: ${utente}, $valorEstatuto: ${valorEstatuto}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_autorizado' });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

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

              // TODO: updateDatabase(estatuto_value_not_enough)

            }

          } else {

            console.error('utente is not in estado inativo');

            // TODO: updateDatabase(utente_not_inativo)

          }
        }

      });

    }

  });

}

function onReporEstadoRealizado(idStream) {

  console.log(`onReporEstadoRealizado called with $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_realizado' });

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

function onReporEstadoNaoRealizado(idStream, razao) {

  console.log(`onReporEstadoNaoRealizado called with $razao: ${razao}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ my: 'repor_estado_nao_realizado' });

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