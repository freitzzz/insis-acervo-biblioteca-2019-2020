using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Event;
using GestaoReservasCommand.Events;
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
            _map.Add(EventName.EmprestimoSobreposto.Value, EmprestimoSobreposto);
            _map.Add(EventName.EmprestimoNaoSobreposto.Value, EmprestimoNaoSobreposto);
            _map.Add(EventName.UtenteAutorizado.Value, UtenteAutorizado);
            _map.Add(EventName.UtenteNaoAutorizado.Value, UtenteNaoAutorizado);
            _map.Add(EventName.ReservaNaoRealizada.Value, ReservaNaoRealizada);
            _map.Add(EventName.ReservaRealizada.Value, ReservaRealizada);

            // create connection  
            var _connection = _factory.CreateConnection();

            // create channel
            _channel = _connection.CreateModel();

            // create exchange
            _channel.ExchangeDeclare(exchange: ExchangeName, ExchangeType.Direct, durable: true);

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

        public string CreateReserva(PedidoReservaDTO reserva)
        {
            var eventName = EventName.ReservaRecebida.Value;
            var streamId = Guid.NewGuid().ToString();
            var reservaEvent = new ReservaRecebidaEvent(reserva.utente, reserva.dataInicio, reserva.dataFim, reserva.obra, streamId);
            var json = JsonConvert.SerializeObject(reservaEvent);
            _eventHandler.SendEvent(_factory, ExchangeName, eventName, json, streamId);

            return streamId;
        }

        private void EmprestimoSobreposto(String content)
        {
            EmprestimoSobrepostoEvent emprestimoSobreposto = JsonConvert.DeserializeObject<EmprestimoSobrepostoEvent>(content);

            var routingKey = EventName.ReservaNaoAceite.Value;
            var json = JsonConvert.SerializeObject(emprestimoSobreposto);
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, emprestimoSobreposto.id_stream);
        }

        private void EmprestimoNaoSobreposto(String content)
        {
            EmprestimoNaoSobrepostoEvent emprestimoNaoSobreposto = JsonConvert.DeserializeObject<EmprestimoNaoSobrepostoEvent>(content);

            var contentUtenteAutorizadoEvent = ContainsEvent(emprestimoNaoSobreposto.id_stream, EventName.UtenteAutorizado.Value);
            if (contentUtenteAutorizadoEvent != null)
            {
                var utenteAutorizado = JsonConvert.DeserializeObject<UtenteAutorizadoEvent>(contentUtenteAutorizadoEvent);
                ValidateReserva(emprestimoNaoSobreposto.dataInicio, emprestimoNaoSobreposto.dataFim, emprestimoNaoSobreposto.obra, emprestimoNaoSobreposto.utente,
                    emprestimoNaoSobreposto.id_stream, utenteAutorizado.obrasAutorizadas, emprestimoNaoSobreposto.obrasSemEmprestimo);
            }
        }

        private void UtenteAutorizado(String content)
        {
            UtenteAutorizadoEvent utenteAutorizadoEvent = JsonConvert.DeserializeObject<UtenteAutorizadoEvent>(content);

            var contentEmprestimoNaoSobrepostoEvent = ContainsEvent(utenteAutorizadoEvent.id_stream, EventName.EmprestimoNaoSobreposto.Value);
            if (contentEmprestimoNaoSobrepostoEvent != null)
            {
                var emprestimoNaoSobreposto = JsonConvert.DeserializeObject<EmprestimoNaoSobrepostoEvent>(contentEmprestimoNaoSobrepostoEvent);
                ValidateReserva(utenteAutorizadoEvent.dataInicio, utenteAutorizadoEvent.dataFim, utenteAutorizadoEvent.obra, utenteAutorizadoEvent.utente,
                    utenteAutorizadoEvent.id_stream, utenteAutorizadoEvent.obrasAutorizadas, emprestimoNaoSobreposto.obrasSemEmprestimo);
            }
        }

        private void UtenteNaoAutorizado(String content)
        {
            UtenteNaoAutorizadoEvent utenteNaoAutorizado = JsonConvert.DeserializeObject<UtenteNaoAutorizadoEvent>(content);

            var routingKey = EventName.ReservaNaoAceite.Value;
            var json = JsonConvert.SerializeObject(utenteNaoAutorizado);
            _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, utenteNaoAutorizado.id_stream);
        }

        public void ValidateReserva(DateTime dataInicio, DateTime dataFim, string obra, string utente, string streamId, List<ObraDTO> obrasAutorizadas, List<ObraDTO> obrasSemEmprestimo)
        {
            var listaReservas = GetReservas(dataInicio, dataFim, obra);

            var routingKey = EventName.ReservaNaoAceite.Value;
            var reservaEvent = new ReservaRecebidaEvent(utente, dataInicio, dataFim, obra, streamId);
            var json = JsonConvert.SerializeObject(reservaEvent);

            _logger.LogDebug(" -- obrasAutorizadas {0} -- ", obrasAutorizadas.Count);
            _logger.LogDebug(" -- obrasSemEmprestimo {0} -- ", obrasSemEmprestimo.Count);

            if (listaReservas != null && listaReservas.Count > 0 && IsReservaOfUtente(listaReservas, utente))
            { //Utente já tem o livro reservado
                _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, streamId);
            }
            else
            {
                var obrasComReservas = new List<ObraDTO>();

                if (listaReservas != null)
                    foreach (var item in listaReservas)
                    {
                        obrasComReservas.Add(item.obra);
                    }
                _logger.LogDebug(" -- obrasComReservas {0} -- ", obrasComReservas.Count);

                var obrasAutorizadasSemEmprestimo = obrasAutorizadas.Intersect(obrasSemEmprestimo).ToList();
                if (obrasAutorizadasSemEmprestimo == null || obrasAutorizadasSemEmprestimo.Count == 0)
                {
                    _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, streamId);
                }
                else
                {
                    _logger.LogDebug(" -- obrasAutorizadasSemEmprestimo {0} -- ", obrasAutorizadasSemEmprestimo.Count);

                    var obrasAutorizadasSemEmprestimoSemReservas = obrasAutorizadasSemEmprestimo.Where(x => !obrasComReservas.Contains(x)).ToList();
                    if (obrasAutorizadasSemEmprestimoSemReservas == null || obrasAutorizadasSemEmprestimoSemReservas.Count == 0)
                    {
                        _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, streamId);
                    }
                    else
                    {
                        _logger.LogDebug(" -- obrasAutorizadasSemEmprestimoSemReservas {0} -- ", obrasAutorizadasSemEmprestimoSemReservas.Count);
                        routingKey = EventName.ReservaAceite.Value;
                        var obraReservar = obrasAutorizadasSemEmprestimoSemReservas[0];
                        json = JsonConvert.SerializeObject(new ReservaAceiteEvent(utente, dataInicio, dataFim, obraReservar, streamId));
                        _eventHandler.SendEvent(_factory, ExchangeName, routingKey, json, streamId);

                    }
                }
            }
        }

        private void ReservaNaoRealizada(string content)
        {
            _logger.LogDebug("ReservaNaoRealizada");
        }
        private void ReservaRealizada(string content)
        {
            _logger.LogDebug("ReservaRealizada");
        }

        private List<ReservaDTO> GetReservas(DateTime dataInicio, DateTime dataFim, String obra)
        {
            var inicio = String.Format("{0:yyyy-MM-ddTHH:mm:ssZ}", dataInicio);
            var fim = String.Format("{0:yyyy-MM-ddTHH:mm:ssZ}", dataFim);
            string urlParameters = $"?dataInicio={inicio}&dataFim={fim}&obra={obra}";

            var response = APICall.RunAsync<ReservaDTO>(_reservaClienteOptions.Value.URL, urlParameters).GetAwaiter().GetResult();

            return response;
        }
        private bool IsReservaOfUtente(List<ReservaDTO> listaReservas, string utente)
        {
            var reservasUtente = listaReservas.FindAll(r => r.utente.Equals(utente));
            if (reservasUtente == null)
            {
                return false;
            }
            _logger.LogDebug("reservasUtente.Count: " + reservasUtente.Count);
            return reservasUtente.Count != 0;
        }

        public string ContainsEvent(string streamId, string routingKey)
        {
            _logger.LogDebug("ContainsEvent : {0} : {1}", streamId, routingKey);
            var events = _eventStoreHandler.GetEvents(streamId);
            foreach (var item in events)
            {
                if (item.Event.EventType == routingKey)
                {
                    _logger.LogDebug(Encoding.UTF8.GetString(item.Event.Data));
                    return Encoding.UTF8.GetString(item.Event.Data);
                }
            }
            return null;
        }

        public bool ContainsStream(string streamId)
        {
            _logger.LogDebug("ContainsStream : {0} ", streamId);
            var events = _eventStoreHandler.GetEvents(streamId);
            _logger.LogDebug("ContainsStream : {0} ", events != null && events.Length != 0);
            return events != null && events.Length != 0;
        }
    }
}
