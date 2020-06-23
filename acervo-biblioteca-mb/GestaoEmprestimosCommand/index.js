const express = require('express');

const cors = require('cors');

const amqp = require('amqplib/callback_api');

const api = require('./api/api.js');

const app = express();

const foldArrayToObject = (array) => array.length > 0 ? array.reduceRight((p, c) => Object.assign(p, c)) : [];

const emprestimoExchange = process.env.EMPRESTIMO_EXCHANGE || 'emprestimo';

const esbHost = process.env.ESB_HOST;

const geQueryHost = process.env.GE_QUERY_HOST;

const eventstore = require('eventstore')({
  type: 'mongodb',
  url: process.env.GEC_MONGODB_CONNECTION_URL,
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

              if (message.startsWith('emprestimo')) {

                exchange = emprestimoExchange;

              }

              channel.publish(exchange, message, Buffer.from(JSON.stringify(data)));
            }

            channel.assertExchange(emprestimoExchange, 'direct', {
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

                channel.bindQueue(queue.queue, emprestimoExchange, 'existe_reserva_utente');
                channel.bindQueue(queue.queue, emprestimoExchange, 'existe_reserva');
                channel.bindQueue(queue.queue, emprestimoExchange, 'nao_existe_reserva');
                channel.bindQueue(queue.queue, emprestimoExchange, 'utente_nao_autorizado');
                channel.bindQueue(queue.queue, emprestimoExchange, 'utente_autorizado');
                channel.bindQueue(queue.queue, emprestimoExchange, 'reserva_recebida');

                channel.consume(queue.queue, function (message) {

                  const body = JSON.parse(message.content);

                  const idStream = body.idStream || '';

                  switch (message.fields.routingKey) {
                    case 'existe_reserva_utente':
                      api.onExisteReservaUtente(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, idStream, esbHost, geQueryHost, publishCallback);
                      break;
                    case 'existe_reserva':
                      api.onExisteReserva(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, body.obrasReservadas, esbHost, geQueryHost, idStream, publishCallback);
                      break;
                    case 'nao_existe_reserva':
                      api.onNaoExisteReserva(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, esbHost, geQueryHost, idStream, publishCallback);
                      break;
                    case 'utente_nao_autorizado':
                      api.onUtenteNaoAutorizado(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, idStream);
                      break;
                    case 'utente_autorizado':
                      api.onUtenteAutorizado(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, obrasAutorizadas, idStream, esbHost, geQueryHost, publishCallback);
                      break;
                    case 'reserva_recebida':
                      api.onReservaRecebida(eventstore, body.utente, body.dataInicio, body.dataFim, body.obra, idStream, esbHost, geQueryHost, publishCallback);
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

                  } else if (events.emprestimo_recusado) {

                    response.status(400).send({ message: `Emprestimo refused` });

                  } else if (events.emprestimo_realizado) {

                    response.status(200).send({ url: `/emprestimos/${events.emprestimo_realizado}` });
                  
                  } else {

                    response.status(202).send({ url: `/commands/${streamId}` });

                  }

                }

              });

            });

            app.post('/emprestimos', function (request, response, _) {

              const body = request.body;

              const utente = body.utente;

              const obra = body.obra;

              const dataInicio = body.dataInicio;

              const dataFim = body.dataFim;

              api.onEmprestimoRecebido(eventstore, utente, obra, dataInicio, dataFim, publishCallback, response);

            });

            app.listen(process.env.PORT);

          }
        });
      }
    });
  }
});


