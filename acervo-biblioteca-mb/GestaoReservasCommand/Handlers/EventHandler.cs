using System;
using System.Collections.Generic;
using System.Text;
using GestaoReservasCommand.Services;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace GestaoReservasCommand.Handlers
{
    public class EventHandler : IEventHandler
    {
        private readonly ILogger<EventHandler> _logger;
        private readonly IEventStoreHandler _eventStoreHandler;

        public EventHandler(ILogger<EventHandler> logger, IEventStoreHandler eventStoreHandler)
        {
            this._logger = logger;
            _eventStoreHandler = eventStoreHandler;
        }
        public void SendEvent(ConnectionFactory factory, string exchangeName, string routingKey, string json, string streamId)
        {
            _logger.LogDebug(" exchangeName {0}, routingKey {1}, streamId {2}", exchangeName, routingKey, streamId);
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: exchangeName,
                                        type: ExchangeType.Direct,
                                        durable: true);

                var body = Encoding.UTF8.GetBytes(json);

                channel.BasicPublish(exchange: exchangeName,
                                    routingKey: routingKey,
                                    basicProperties: null,
                                    body: body);

                _eventStoreHandler.AddEvent(streamId, routingKey, json, "{}");
                _logger.LogDebug(" [x] Sent {0}", json);
            }
        }

        public void BindQueues(IModel channel, string exchangeName, string queueName, List<string> routingKeys)
        {
            _logger.LogDebug("InitializeQueue");
            _logger.LogDebug("queueName: " + queueName);
            
            foreach (var routingKey in routingKeys)
            {
                _logger.LogDebug("routingKey: " + routingKey);
                channel.QueueBind(queue: queueName,
                                    exchange: exchangeName,
                                    routingKey: routingKey);
            }
        }

        public void ReceiveEvent(IModel channel, string exchangeName, string queueName, Dictionary<string, Action<string>> map)
        {
            var consumer = new EventingBasicConsumer(channel);

            _logger.LogDebug(" [*] Waiting for messages.");

            consumer.Received += (model, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body.ToArray());
                JObject json = JObject.Parse(message);
                var routingKey = ea.RoutingKey;

                _logger.LogDebug(" [x] Received '{0}':'{1}'", routingKey, json);

                var streamId = json.Value<string>("id_stream");
                _eventStoreHandler.AddEvent(streamId, routingKey, message, "{}");

                Action<string> action = map.GetValueOrDefault(routingKey);
                action(json.ToString());

                channel.BasicAck(ea.DeliveryTag, false);
            };
            channel.BasicConsume(queue: queueName,
                                 autoAck: true,
                                 consumer: consumer);

        }
    }
}