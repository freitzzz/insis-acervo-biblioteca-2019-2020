using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace GestaoReservasCommand.Services
{
    public class EmprestimoService : BackgroundService, IEmprestimoService
    {
        private readonly ILogger<EmprestimoService> _logger;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly IOptions<ReservaClienteConfiguration> _reservaClienteOptions;
        private readonly String _queueName = "emprestimo_recebido";
        private IModel _channel;

        public EmprestimoService(ILogger<EmprestimoService> logger, IOptions<RabbitMqConfiguration> rabbitMqOptions, IOptions<ReservaClienteConfiguration> reservaClienteOptions)
        {
            _logger = logger;
            _rabbitMqOptions = rabbitMqOptions;
            _reservaClienteOptions = reservaClienteOptions;
            InitializeRabbitMqListener();
        }

        private void InitializeRabbitMqListener()
        {
            var factory = new ConnectionFactory
            {
                HostName = _rabbitMqOptions.Value.Hostname,
                UserName = _rabbitMqOptions.Value.UserName,
                Password = _rabbitMqOptions.Value.Password
            };
            var _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclare(queue: _queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (model, ea) =>
            {
                var content = Encoding.UTF8.GetString(ea.Body.ToArray());
                var emprestimo = JsonConvert.DeserializeObject<EmprestimoDTO>(content);

                ValidateEmprestimo(emprestimo);

                _channel.BasicAck(ea.DeliveryTag, false);
            };

            _channel.BasicConsume(_queueName, false, consumer);

            return Task.CompletedTask;
        }

        private void ValidateEmprestimo(EmprestimoDTO emprestimo)
        {
            var reserva = new ReservaDTO(emprestimo.utente, emprestimo.dataInicio, emprestimo.dataFim, emprestimo.obra);
            var routingKey = "nao_existe_reserva";
            
            if (HasReservaInPeriodo(reserva))
            {
                if (IsReservaOfUtente(reserva))
                {
                    routingKey = "existe_reserva_nao_utente";
                } else {
                    routingKey = "existe_reserva_utente";
                }
            }

            // using (var connection = factory.CreateConnection())
            // using (var channel = connection.CreateModel())
            // {
            //     channel.ExchangeDeclare(exchange: _rabbitMqOptions.Value.ExchangeName,
            //                             type: "direct");

            var json = JsonConvert.SerializeObject(emprestimo);
            var body = Encoding.UTF8.GetBytes(json);

            //     channel.BasicPublish(exchange: _rabbitMqOptions.Value.ExchangeName,
            //                         routingKey: routingKey,
            //                         basicProperties: null,
            //                         body: body);

            _logger.LogDebug(" [x] Sent {0}", json);
            // }
        }
        private bool HasReservaInPeriodo(ReservaDTO reserva)
        {
            string urlParameters = $"?dataInicio={reserva.dataInicio}&dataFim={reserva.dataFim}&obra={reserva.obra}";
            var response = APICall.RunAsync<ListReservaDTO>(_reservaClienteOptions.Value.URL, urlParameters).GetAwaiter().GetResult();
            
            return response.lista.Count>0;
        }

        private bool IsReservaOfUtente(ReservaDTO reserva)
        {
            string urlParameters = $"/utente/{reserva.utente}?dataInicio={reserva.dataInicio}&dataFim={reserva.dataFim}&obra={reserva.obra}";
            var response = APICall.RunAsync<ReservaDTO>(_reservaClienteOptions.Value.URL, urlParameters).GetAwaiter().GetResult();
            
            return response != null;
        }
    }
}
