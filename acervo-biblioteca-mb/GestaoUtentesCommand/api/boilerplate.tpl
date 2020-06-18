function onReporEstadoRecebido(idUtente, idBibliotecarioMor, valorEstatuto) {

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