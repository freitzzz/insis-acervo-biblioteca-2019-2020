using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using GestaoReservasQuery.Configurations;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Event;
using GestaoReservasQuery.Events;
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
    public class EventsService : BackgroundService
    {
        private readonly ILogger<EventsService> _logger;
        private readonly IMapper _mapper;
        private readonly IServiceScopeFactory _services;
        private readonly IReservaSpecification _reservaSpecification;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly ConnectionFactory _factory;
        private readonly String ExchangeName = "reserva";
        private IModel _channel;
        private IConnection _connection;
        private String _queueName;

        public EventsService(ILogger<EventsService> logger, IServiceScopeFactory services, IMapper mapper, IReservaSpecification reservaSpecification, IOptions<RabbitMqConfiguration> rabbitMqOptions)
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
                                routingKey: EventName.ReservaAceite.Value);
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
            using (var scope = _services.CreateScope())
            {
                var eventReceived = JsonConvert.DeserializeObject<ReservaAceiteEvent>(content);
                var reserva = new Reserva(eventReceived.utente, eventReceived.dataInicio, eventReceived.dataFim, _mapper.Map<Obra>(eventReceived.obra), ReservaEstado.NaoCumprida.ToString());

                if (GetReserva(reserva.dataInicio.ToString(), reserva.dataFim.ToString(), reserva.obra.titulo, reserva.utente) == null)
                {
                    //save on database
                    var dbContext = scope.ServiceProvider.GetRequiredService<GestaoReservasQueryContext>();
                    dbContext.Set<Reserva>().Add(reserva);
                    dbContext.SaveChanges();

                    // send event
                    var reservaRealizada = new ReservaRealizadaEvent(reserva.Id, eventReceived.streamId);
                    SendEvent(EventName.ReservaRealizada.Value, JsonConvert.SerializeObject(reserva));
                    _logger.LogDebug("Reserva was added to DataBase");
                }
                else
                {
                    var reservaNaoRealizada = new ReservaNaoRealizadaEvent("Reserva already exists on Database", eventReceived.streamId);
                    SendEvent(EventName.ReservaNaoRealizada.Value, JsonConvert.SerializeObject(reserva));
                    _logger.LogDebug("Reserva was NOT added to DataBase");
                }
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
                    _logger.LogDebug("Count " + lista.Count);
                    ReservaDTO reserva = _mapper.Map<ReservaDTO>(lista[0]);
                    return reserva;
                }

                return null;
            }
        }

        private void SendEvent(string routingKey, string json)
        {
            _logger.LogDebug(" [x] Sent to {0}, {1}, {2}", _factory.HostName, _factory.UserName, _factory.Password);
            using (var connection = _factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: ExchangeName,
                                        type: ExchangeType.Direct);

                var body = Encoding.UTF8.GetBytes(json);

                channel.BasicPublish(exchange: ExchangeName,
                                    routingKey: routingKey,
                                    basicProperties: null,
                                    body: body);

                _logger.LogDebug(" [x] Sent {0}", json);
            }
        }

    }
}
