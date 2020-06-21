using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Event;
using GestaoReservasCommand.Handlers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace GestaoReservasCommand.Services
{
    public class EmprestimoService : BackgroundService, IEmprestimoService
    {
        private readonly ILogger<EmprestimoService> _logger;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly IOptions<ReservaClienteConfiguration> _reservaClienteOptions;
        private readonly IEventHandler _eventHandler;
        private readonly IEventStoreHandler _eventStoreHandler;
        private readonly ConnectionFactory _factory;
        private readonly String ExchangeName = "emprestimo";
        private IModel _channel;

        public EmprestimoService(ILogger<EmprestimoService> logger, IOptions<RabbitMqConfiguration> rabbitMqOptions, 
                IOptions<ReservaClienteConfiguration> reservaClienteOptions, IEventHandler eventHandler,
                IEventStoreHandler eventStoreHandler)
        {
            _logger = logger;
            _rabbitMqOptions = rabbitMqOptions;
            _reservaClienteOptions = reservaClienteOptions;
            _eventHandler = eventHandler;
            _eventStoreHandler = eventStoreHandler;
            
            _factory = new ConnectionFactory
            {
                HostName = _rabbitMqOptions.Value.Hostname,
                UserName = _rabbitMqOptions.Value.UserName,
                Password = _rabbitMqOptions.Value.Password
            };

            InitializeRabbitMqListener();
        }

        private void InitializeRabbitMqListener()
        {
            var _connection = _factory.CreateConnection();
            _channel = _connection.CreateModel();
            // _channel.QueueDeclare(queue: _queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            _channel.ExchangeDeclare(exchange: ExchangeName, type: "direct");
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // var consumer = new EventingBasicConsumer(_channel);
            // consumer.Received += (model, ea) =>
            // {
            //     var content = Encoding.UTF8.GetString(ea.Body.ToArray());
            //     var emprestimo = JsonConvert.DeserializeObject<EmprestimoDTO>(content);

            //     ValidateEmprestimo(emprestimo);

            //     _channel.BasicAck(ea.DeliveryTag, false);
            // };

            // _channel.BasicConsume(_queueName, false, consumer);

            // _eventHandler.ReceiveEvent(_channel, ExchangeName, "emprestimo_recebido", ValidateEmprestimo);
            return Task.CompletedTask;
        }

        private void ValidateEmprestimo(String content)
        {
            EmprestimoDTO emprestimo = JsonConvert.DeserializeObject<EmprestimoDTO>(content);
            _eventStoreHandler.AddEvent("TODO", "emprestimo_recebido", content, "{}");
            
            var listaReservas = GetReservas(emprestimo.dataFim, emprestimo.dataFim, emprestimo.obra);

            var routingKey = "nao_existe_reserva";
            var json = JsonConvert.SerializeObject(emprestimo);
            if (HasReservaInPeriodo(listaReservas))
            {
                if (IsReservaOfUtente(listaReservas, emprestimo.utente))
                {
                    var existeReserva = new ExisteReservaEvent(emprestimo.utente, emprestimo.dataFim, emprestimo.dataFim, emprestimo.obra, listaReservas);
                    json = JsonConvert.SerializeObject(existeReserva);
                    routingKey = "existe_reserva";
                }
                else
                {
                    routingKey = "existe_reserva_utente";
                }
            }

            
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, "TODO");
            
            // using (var connection = factory.CreateConnection())
            // using (var channel = connection.CreateModel())
            // {
            //     channel.ExchangeDeclare(exchange: _rabbitMqOptions.Value.ExchangeName,
            //                             type: "direct");

            // var json = JsonConvert.SerializeObject(emprestimo);
            // var body = Encoding.UTF8.GetBytes(json);

            //     channel.BasicPublish(exchange: _rabbitMqOptions.Value.ExchangeName,
            //                         routingKey: routingKey,
            //                         basicProperties: null,
            //                         body: body);

            // _logger.LogDebug(" [x] Sent {0}", json);
            // }
        }

        private List<ReservaDTO> GetReservas(DateTime dataInicio, DateTime dataFim, String obra)
        {
            string urlParameters = $"?dataInicio={dataInicio}&dataFim={dataFim}&obra={obra}";
            var response = APICall.RunAsync<ReservaDTO>(_reservaClienteOptions.Value.URL, urlParameters).GetAwaiter().GetResult();

            return response;
        }

        private bool HasReservaInPeriodo(List<ReservaDTO> listaReservas)
        {
            return listaReservas.Count > 0;
        }

        private bool IsReservaOfUtente(List<ReservaDTO> listaReservas, string utente)
        {
            var reservasUtente = listaReservas.FindAll(r => r.utente.Equals(utente));
            _logger.LogDebug("reservasUtente.Count: " + reservasUtente.Count);
            return reservasUtente.Count != 0;
        }
    }
}
