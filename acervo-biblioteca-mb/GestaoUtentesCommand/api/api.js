const eventstore = require('eventstore')();

function onReporEstadoRecebido(idUtente, idBibliotecarioMor, valorEstatuto) {

  console.log(`onReporEstadoRecebido called with $idUtente: ${idUtente}, $idBibliotecarioMor: ${idBibliotecarioMor}, $valorEstatuto: ${valorEstatuto}`);

  eventstore.getNewId(function (idError, newId) {

    if (idError) {
      console.error(`Failed to get new stream id due to: ${idError}`);
    } else {
      console.log(`Got new stream id: ${newId}`);
    }

  });

}

exports.onReporEstadoRecebido = onReporEstadoRecebido;