using System;
using System.Collections.Generic;
using RabbitMQ.Client;

namespace GestaoReservasCommand.Handlers
{
    public interface IEventHandler
    {
        void SendEvent(ConnectionFactory _factory, string exchangeName, string routingKey, string bodyJson, string streamId);
        void BindQueues(IModel channel, string exchangeName, string queueName, List<string> routingKeys);
        // void ReceiveEvent(IModel channel, String exchangeName, String routingKey, Action<String> callBack);
        void ReceiveEvent(IModel channel, string exchangeName, string queueName, Dictionary<string, Action<string>> map);
    }
}