using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Event;
using GestaoReservasCommand.Handlers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace GestaoReservasCommand.Services
{
    public class ReservaService : BackgroundService, IReservaService
    {
        private readonly ILogger<ReservaService> _logger;
        private readonly IOptions<RabbitMqConfiguration> _rabbitMqOptions;
        private readonly IOptions<ReservaClienteConfiguration> _reservaClienteOptions;
        private readonly IEventHandler _eventHandler;
        private readonly IEventStoreHandler _eventStoreHandler;
        private readonly ConnectionFactory _factory;
        private readonly String ExchangeName = "reserva";
        Dictionary<string, Action<string>> _map;
        private IModel _channel;
        private String _queueName;

        public ReservaService(ILogger<ReservaService> logger, IOptions<RabbitMqConfiguration> rabbitMqOptions,
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
            _map.Add("emprestimo_sobreposto", EmprestimoSobreposto);
            _map.Add("emprestimo_nao_sobreposto", EmprestimoNaoSobreposto);
            _map.Add("utente_autorizado", UtenteAutorizado);
            _map.Add("utente_nao_autorizado", UtenteNaoAutorizado);

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

        public string CreateReserva(ReservaDTO reserva)
        {
            var eventName = "reserva_recebida";
            var json = JsonConvert.SerializeObject(reserva);
            var streamId = Guid.NewGuid().ToString();
            _eventHandler.SendEvent(_factory, ExchangeName, eventName, json, streamId);

            return streamId;
        }

        private void EmprestimoSobreposto(String content)
        {
            EmprestimoSobrepostoEvent emprestimoSobreposto = JsonConvert.DeserializeObject<EmprestimoSobrepostoEvent>(content);

            var routingKey = "reserva_nao_existe";
            var json = JsonConvert.SerializeObject(emprestimoSobreposto);
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, emprestimoSobreposto.streamId);
        }

        private void EmprestimoNaoSobreposto(String content)
        {
            EmprestimoNaoSobrepostoEvent emprestimoNaoSobreposto = JsonConvert.DeserializeObject<EmprestimoNaoSobrepostoEvent>(content);
            
            // TODO 
        }

        private void UtenteAutorizado(String content)
        {
            EmprestimoDTO emprestimo = JsonConvert.DeserializeObject<EmprestimoDTO>(content);


            // TODO 
        }

        private void UtenteNaoAutorizado(String content)
        {
            UtenteNaoAutorizadoEvent utenteNaoAutorizado = JsonConvert.DeserializeObject<UtenteNaoAutorizadoEvent>(content);

            var routingKey = "reserva_nao_existe";
            var json = JsonConvert.SerializeObject(utenteNaoAutorizado);
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, utenteNaoAutorizado.streamId);
        }

        private void ValidateReserva(DateTime dataInicio, DateTime dataFim, String obra, List<ObraDTO> obrasAutorizadas, List<ObraDTO> obrasSemEmprestimo)
        {
            var listaReservas = GetReservas(dataFim, dataFim, obra);
            //TODO
        }

        private List<ReservaDTO> GetReservas(DateTime dataInicio, DateTime dataFim, String obra)
        {
            string urlParameters = $"?dataInicio={dataInicio}&dataFim={dataFim}&obra={obra}";
            var response = APICall.RunAsync<ReservaDTO>(_reservaClienteOptions.Value.URL, urlParameters).GetAwaiter().GetResult();

            return response;
        }

        public ResolvedEvent[] GetStreamInfo(string streamId)
        {
            var events = _eventStoreHandler.GetLastEvent(streamId);
            return events;
        }
    }
}
