const eventstore = require('eventstore')();

function onReporEstadoRecebido(idUtente, idBibliotecarioMor, valorEstatuto, publishCallback) {

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

            }

          });

        }

      });
    }

  });

}

function onReporEstadoUtenteNaoEncontrado(idUtente, idStream) { }

function onReporEstadoBibliotecarioMorNaoEncontrado(idBibliotecarioMor, idStream) { }

function onReporEstadoNaoAutorizado(bibliotecarioMor, idStream) { }

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