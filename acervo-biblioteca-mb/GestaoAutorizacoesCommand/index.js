const express = require('express');

const cors = require('cors');

const amqp = require('amqplib/callback_api');

const api = require('./api/api.js');

const app = express();

const foldArrayToObject = (array) => array.length > 0 ? array.reduceRight((p, c) => Object.assign(p, c)) : [];

const reporEstadoExchange = process.env.REPOR_ESTADO_EXCHANGE || 'repor_estado';

const eventstore = require('eventstore')({
  type: 'mongodb',
  url: process.env.GUC_MONGODB_CONNECTION_URL,
  options: {
    ssl: true,
    autoReconnect: false,
    useNewUrlParser: true
  }
});


eventstore.init(function (eventStoreInitError) {

  if (eventStoreInitError) {

    console.error(`Failed to open connection with event store due to: ${eventStoreInitError}`);

    throw eventStoreInitError;

  } else {

    amqp.connect(process.env.RABBIT_MQ_CONNECTION_URL, function (errorConnectRabbitMQ, connection) {

      if (errorConnectRabbitMQ) {

        console.error(`Failed to connect to RabbitMQ server with connection string: ${process.env.RABBIT_MQ_CONNECTION_URL} due to: ${errorConnectRabbitMQ}`);

        throw errorConnectRabbitMQ;

      } else {

        connection.createChannel(function (errorCreateChannel, channel) {

          if (errorCreateChannel) {

            console.error(`Failed to create channel on RabbitMQ server due to: ${errorCreateChannel}`);

            throw errorCreateChannel;

          } else {

            const publishCallback = function (message, data) {

              let exchange;

              if (message.startsWith('repor_estado')) {

                exchange = reporEstadoExchange;

              }

              channel.publish(exchange, message, Buffer.from(JSON.stringify(data)));
            }

            channel.assertExchange(reporEstadoExchange, 'direct', {
              durable: true
            });

            channel.assertQueue('', {
              exclusive: false,
              durable: true
            }, function (errorAssertingQueue, queue) {

              if (errorAssertingQueue) {

                console.error(`Failed asserting queue due to ${errorAssertingQueue}`);

                throw errorAssertingQueue;

              } else {

                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_utente_nao_encontrado');
                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_bibliotecario_mor_nao_encontrado');
                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_nao_autorizado');
                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_autorizado');
                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_realizado');
                channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_nao_realizado');

                channel.consume(queue.queue, function (message) {

                  const body = JSON.parse(message.content);

                  const idStream = body.id_stream || '';

                  switch (message.fields.routingKey) {
                    case 'repor_estado_utente_nao_encontrado':
                      api.onReporEstadoUtenteNaoEncontrado(eventstore, body.id_utente, idStream);
                      break;
                    case 'repor_estado_bibliotecario_mor_nao_encontrado':
                      api.onReporEstadoBibliotecarioMorNaoEncontrado(eventstore, body.id_bibliotecario_mor, idStream);
                      break;
                    case 'repor_estado_nao_autorizado':
                      api.onReporEstadoNaoAutorizado(eventstore, body.id_bibliotecario_mor, idStream);
                      break;
                    case 'repor_estado_autorizado':
                      api.onReporEstadoAutorizado(eventstore, body.utente, valor_estatuto, idStream, publishCallback);
                      break;
                    case 'repor_estado_realizado':
                      api.onReporEstadoRealizado(eventstore, body.id_utente, idStream);
                    case 'repor_estado_nao_realizado':
                      api.onReporEstadoNaoRealizado(eventstore, body.id_utente, idStream);
                      break;
                    default:
                      console.warn(`Got unknown message: ${message.fields.routingKey}`);
                      break;
                  }
                }, {
                  noAck: false
                });
              }
            });

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

                  const events = foldArrayToObject(stream.events.map((event => event.payload)));
                  if (events.length == 0) {

                    response.status(404).send({ message: `Command with id: ${streamId} not found` });

                  } else if (events.repor_estado_utente_nao_encontrado) {

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

          }
        });
      }
    });
  }
});


