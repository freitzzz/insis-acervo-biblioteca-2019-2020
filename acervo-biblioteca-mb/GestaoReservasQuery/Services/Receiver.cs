using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using GestaoReservasQuery.Configurations;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;
using GestaoReservasQuery.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace GestaoReservasQuery.Services
{
    public class Receiver : BackgroundService
    {
        private readonly ILogger<Receiver> _logger;
        private readonly IMapper _mapper;
        private readonly IServiceScopeFactory _services;
        private readonly IReservaSpecification _reservaSpecification;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly ConnectionFactory _factory;
        private readonly String ExchangeName = "reserva";
        private IModel _channel;
        private IConnection _connection;
        private String _queueName;

        public Receiver(ILogger<Receiver> logger, IServiceScopeFactory services, IMapper mapper, IReservaSpecification reservaSpecification, IOptions<RabbitMqConfiguration> rabbitMqOptions)
        {
            _logger = logger;
            _services = services;
            _mapper = mapper;
            _reservaSpecification = reservaSpecification;

            _rabbitMqOptions = rabbitMqOptions;

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
            // create connection  
            _connection = _factory.CreateConnection();

            // create channel  
            _channel = _connection.CreateModel();

            // create exchange
            _channel.ExchangeDeclare(exchange: ExchangeName, ExchangeType.Direct);

            // declare queue
            _queueName = _channel.QueueDeclare("", false, false, false, null).QueueName;

            // bind queue
            _channel.QueueBind(queue: _queueName,
                                exchange: ExchangeName,
                                routingKey: "reserva_realizada");
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (ch, ea) =>
            {
                // received message  
                var content = System.Text.Encoding.UTF8.GetString(ea.Body.ToArray());

                // handle the received message  
                AddReserva(content);
                _channel.BasicAck(ea.DeliveryTag, false);
            };

            _channel.BasicConsume(_queueName, false, consumer);
            return Task.CompletedTask;
        }

        private void AddReserva(string content)
        {
            var dto = JsonConvert.DeserializeObject<ReservaDTO>(content);
            dto.estado = ReservaEstado.NaoCumprida.ToString();
            Reserva reserva = _mapper.Map<Reserva>(dto);
            using (var scope = _services.CreateScope())
            {
                if (GetReserva(dto.dataInicio.ToString(), dto.dataFim.ToString(), dto.obra.titulo, dto.utente) == null)
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<GestaoReservasQueryContext>();
                    dbContext.Set<Reserva>().Add(reserva);
                    dbContext.SaveChanges();
                    
                    _logger.LogDebug("Reserva was added to DataBase");
                }
                else
                    _logger.LogDebug("Reserva was NOT added to DataBase");
            }
        }

        private ReservaDTO GetReserva(String dataInicio, String dataFim, String obra, String utente)
        {
            using (var scope = _services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<GestaoReservasQueryContext>();
                var spec = _reservaSpecification.ReservaInPeriodoOfObraOfUtente(DateTime.Parse(dataInicio), DateTime.Parse(dataFim), obra, utente);
                
                var lista = dbContext.Set<Reserva>().Include(spec.Include).Where(spec.Criteria).ToList();
                
                if (lista != null && lista.Count != 0)
                {
                    Console.WriteLine("Count " + lista.Count);
                    ReservaDTO reserva = _mapper.Map<ReservaDTO>(lista[0]);
                    return reserva;
                }
                
                return null;
            }
        }
    }
}
