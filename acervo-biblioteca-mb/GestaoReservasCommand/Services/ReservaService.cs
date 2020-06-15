using System.Text;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace GestaoReservasCommand.Services
{
    public class ReservaService : IReservaService
    {
        private readonly ILogger<ReservaService> _logger;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly ConnectionFactory _factory;
        private IModel _channel;
        
        public ReservaService(ILogger<ReservaService> logger, IOptions<RabbitMqConfiguration> rabbitMqOptions)
        {
            _logger = logger;
            _rabbitMqOptions = rabbitMqOptions;

            _factory = new ConnectionFactory
            {
                HostName = _rabbitMqOptions.Value.Hostname, 
                UserName = _rabbitMqOptions.Value.UserName, 
                Password = _rabbitMqOptions.Value.Password 
            };
        }

        public void CreateReserva(ReservaDTO reserva)
        {
            var factory = new ConnectionFactory
            {
                HostName = _rabbitMqOptions.Value.Hostname, 
                UserName = _rabbitMqOptions.Value.UserName, 
                Password = _rabbitMqOptions.Value.Password 
            };
                _logger.LogDebug(" [x] Sent {0}, {1}, {2}", _factory.HostName, _factory.UserName, _factory.Password);

            // using (var connection = factory.CreateConnection())
            // using (var channel = connection.CreateModel())
            // {
            //     channel.ExchangeDeclare(exchange: _rabbitMqOptions.Value.ExchangeName,
            //                             type: "direct");

                var json = JsonConvert.SerializeObject(reserva);
                var body = Encoding.UTF8.GetBytes(json);

            //     channel.BasicPublish(exchange: _exchangeName,
            //                         routingKey: "reserva_recebida",
            //                         basicProperties: null,
            //                         body: body);

                _logger.LogDebug(" [x] Sent {0}", json);
            // }
        }
    }
}
