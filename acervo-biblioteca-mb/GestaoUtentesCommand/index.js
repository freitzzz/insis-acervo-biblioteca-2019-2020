const express = require('express');

const cors = require('cors');

const amqp = require('amqplib/callback_api');

const api = require('./api/api.js');

const app = express();

const eventstore = require('eventstore')();

const publishCallback = function (message, data) {

}

app.use(cors());

app.use(express.json());

app.get('/commands/:id', function (request, response, _) {

  const streamId = request.params.id;

  eventstore.getEventStream(streamId, function (error, stream) {

    if (error) {

      console.log(`Got error retrieving events of stream: ${streamId} due to: ${error}`);

      response.status(404).send();

    } else {

      console.log(`Got events history of stream: ${streamId}`);

      const events = stream.events[0].payload;

      if (events.repor_estado_utente_nao_encontrado) {

        response.status(404).send({ message: `Utente with id: ${events.repor_estado_utente_nao_encontrado} not found` });

      } else if (events.repor_estado_bibliotecario_mor_nao_encontrado) {

        response.status(404).send({ message: `Bibliotecário-Mor with id: ${events.repor_estado_bibliotecario_mor_nao_encontrado} not found` });
      } else if (events.repor_estado_nao_autorizado) {

        response.status(401).send({ message: `Bibliotecário-Mor with id: ${events.repor_estado_nao_autorizado} is not allowed to perform repor utente estado operation` });
      } else if (events.repor_estado_estatuto_value_not_enough) {

        response.status(400).send({ message: `Estatuto with value: ${events.repor_estado_estatuto_value_not_enough} is not enough to perform repor utente estado operation` });
      } else if (events.repor_estado_utente_not_inativo) {

        response.status(400).send({ message: `Utente with id: ${events.repor_estado_utente_not_inativo} is not inativo` });

      } else if (events.repor_estado_nao_realizado) {

        response.status(500).send({ message: `Operation failed due to server failure. Reason: ${events.repor_estado_nao_realizado}` });
      } else if (events.repor_estado_realizado) {

        response.status(200).send({ url: `/utentes/${events.repor_estado_realizado}` });
      } else {

        response.status(202).send({ url: `/commands/${streamId}` });

      }

    }

  });

});

app.put('/utentes/:id', function (request, response, _) {

  const body = request.body;

  const idUtente = request.params.id;

  const idBibliotecarioMor = request.headers.id_bibliotecario_mor;

  const valorEstatuto = body.estatuto;

  api.onReporEstadoRecebido(eventstore, idUtente, idBibliotecarioMor, valorEstatuto, publishCallback, response);

});

app.listen(process.env.PORT);

amqp.connect(process.env.RABBIT_MQ_CONNECTION_URL, function (error0, connection) { });