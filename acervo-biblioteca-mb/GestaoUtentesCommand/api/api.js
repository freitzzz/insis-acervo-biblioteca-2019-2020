const eventstore = require('eventstore')();

// TODO: What to do in error cases ?

// TODO: Maybe URL can be composed by stream id?

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

function onReporEstadoAutorizado(utente, valorEstatuto, idStream, publishCallback) { }

function onReporEstadoRealizado(idStream) { }

function onReporEstadoNaoRealizado(idStream, razao) { }


exports.onReporEstadoRecebido = onReporEstadoRecebido;
exports.onReporEstadoAutorizado = onReporEstadoAutorizado;
exports.onReporEstadoBibliotecarioMorNaoEncontrado = onReporEstadoBibliotecarioMorNaoEncontrado;
exports.onReporEstadoNaoAutorizado = onReporEstadoNaoAutorizado;
exports.onReporEstadoNaoRealizado = onReporEstadoNaoRealizado;
exports.onReporEstadoRealizado = onReporEstadoRealizado;
exports.onReporEstadoRecebido = onReporEstadoRecebido;
exports.onReporEstadoUtenteNaoEncontrado = onReporEstadoUtenteNaoEncontrado;