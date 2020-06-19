const amqp = require('amqplib/callback_api');

const api = require('./api/api.js');

const reporEstadoExchange = process.env.REPOR_ESTADO_EXCHANGE || 'repor_estado';

const guQueryHost = process.env.GU_QUERY_HOST;

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

            channel.bindQueue(queue.queue, reporEstadoExchange, 'repor_estado_recebido');
            channel.consume(queue.queue, function (message) {

              const body = JSON.parse(message.content);

              const idStream = body.id_stream || '';

              switch (message.fields.routingKey) {
                case 'repor_estado_recebido':
                  api.onReporEstadoRecebido(guQueryHost, body.id_utente, body.id_bibliotecario_mor, body.valor_estatuto, idStream, publishCallback);
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
      }
    });
  }
});