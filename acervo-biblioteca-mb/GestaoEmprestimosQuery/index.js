const express = require('express');

const cors = require('cors');

const moongoose = require('mongoose');

const amqp = require('amqplib/callback_api');

const api = require('./api/api.js');

const app = express();

moongoose.connect(process.env.GUQ_MONGODB_CONNECTION_URL, { useNewUrlParser: true });

const emprestimosExchange = process.env.EMPRESTIMO_EXCHANGE || 'emprestimo';

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

            exchange = emprestimosExchange;

          }

          channel.publish(exchange, message, Buffer.from(JSON.stringify(data)));
        }

        channel.assertExchange(emprestimosExchange, 'direct', {
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

            channel.bindQueue(queue.queue, emprestimosExchange, 'emprestimo_aceite');

            channel.consume(queue.queue, function (message) {

              const body = JSON.parse(message.content);

              const idStream = body.id_stream || '';

              switch (message.fields.routingKey) {
                case 'emprestimo_aceite':
                  api.onEmprestimoAceite(body.utente, body.dataInicio, body.dataFim, body.obra, idStream, publishCallback);
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

        app.post('/utentes', api.createEmprestimo);

        app.get('/utentes/:id', api.getEmprestimo);

        app.put('/utentes/:id', api.updateEmprestimo);

        app.listen(process.env.PORT);

      }
    });
  }
});