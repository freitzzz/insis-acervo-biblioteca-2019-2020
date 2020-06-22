using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Event;
using GestaoReservasCommand.Events;
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
        Dictionary<string, Action<string>> _map;
        private IModel _channel;
        private String _queueName;

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
            _map = new Dictionary<string, Action<string>>();
            _map.Add(EventName.EmprestimoRecebido.Value, ValidateEmprestimo);

            // create connection  
            var _connection = _factory.CreateConnection();

            // create channel
            _channel = _connection.CreateModel();

            // create exchange
            _channel.ExchangeDeclare(exchange: ExchangeName, ExchangeType.Direct);

            // declare queue
            _queueName = _channel.QueueDeclare("", false, false, false, null).QueueName;

            // bind queues
            _eventHandler.BindQueues(_channel, ExchangeName, _queueName, new List<string>(_map.Keys));

        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogDebug("ExecuteAsync");
            _eventHandler.ReceiveEvent(_channel, ExchangeName, _queueName, _map);

            return Task.CompletedTask;
        }

        private void ValidateEmprestimo(String content)
        {
            EmprestimoEvent emprestimo = JsonConvert.DeserializeObject<EmprestimoEvent>(content);

            var listaReservas = GetReservas(emprestimo.dataFim, emprestimo.dataFim, emprestimo.obra);

            var routingKey = EventName.NaoExisteReservas.Value;
            var json = JsonConvert.SerializeObject(emprestimo);
            if (HasReservaInPeriodo(listaReservas))
            {
                var obraReservadaOfUtente = GetObraReservadaOfUtente(listaReservas, emprestimo.utente);
                if (obraReservadaOfUtente != null)
                {
                    routingKey = EventName.ExisteReservaUtente.Value;
                    var emprestimoUtente = new ReservaUtenteEvent(emprestimo.utente, emprestimo.dataFim, emprestimo.dataFim, obraReservadaOfUtente, emprestimo.streamId);
                    json = JsonConvert.SerializeObject(emprestimoUtente);
                }
                else
                {
                    var existeReserva = new ExisteReservaEvent(emprestimo.utente, emprestimo.dataFim, emprestimo.dataFim, emprestimo.obra, GetObrasReservadas(listaReservas), emprestimo.streamId);
                    json = JsonConvert.SerializeObject(existeReserva);
                    routingKey = EventName.ExisteReservas.Value;
                }
            }
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, emprestimo.streamId);
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

        private ObraDTO GetObraReservadaOfUtente(List<ReservaDTO> listaReservas, string utente)
        {
            var reservasUtente = listaReservas.FindAll(r => r.utente.Equals(utente));
            if (reservasUtente != null && reservasUtente.Count != 0)
            {
                _logger.LogDebug("reservasUtente.Count: " + reservasUtente.Count);
                return reservasUtente[0].obra;

            }
            return null;
        }

        private List<ObraDTO> GetObrasReservadas(List<ReservaDTO> listaReservas)
        {
            var obrasReservadas = new List<ObraDTO>();

            if (listaReservas != null)
                foreach (var item in listaReservas)
                {
                    obrasReservadas.Add(item.obra);
                }

            return obrasReservadas;
        }
    }
}
