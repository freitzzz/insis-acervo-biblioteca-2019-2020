using System;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Events;
using GestaoReservasCommand.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using GestaoReservasCommand.Event;

namespace GestaoReservasCommand.Controllers
{
    [ApiController]
    [Route("reservas")]
    public class ReservaController : ControllerBase
    {
        private readonly ILogger<ReservaController> _logger;
        private readonly IReservaService _reservaService;

        public ReservaController(ILogger<ReservaController> logger, IReservaService reservaService)
        {
            _logger = logger;
            _reservaService = reservaService;
        }

        [HttpGet]
        public string CreateGet()
        {
            _logger.LogDebug(" -- TO BE REMOVED -- ");
            DateTime date = DateTime.Now;
            return date.ToString();
        }

        [HttpGet("commands/{streamId}")]
        public ActionResult<ReservaDTO> GetResouceInfo([FromRoute] String streamId)
        {
            _logger.LogDebug(" -- GetResouceInfo -- ");
            var events = _reservaService.GetStreamInfo(streamId);
            
            if (events == null || events.Length == 0)
                return NotFound(new ResponseMessageDTO(String.Format("Command with id: {0} not found", streamId)));

            if (events[0].Event.EventType.Equals(EventName.ReservaRealizada))
            {
                var reservaRealizada = JsonConvert.DeserializeObject<ReservaRealizadaEvent>(events[0].Event.Data.ToString());
                return Ok(new ResourceDTO(String.Format("/reservas/{0}", reservaRealizada.reservaId)));
            }
            if (events[0].Event.EventType.Equals(EventName.ReservaNaoRealizada))
            {
                var reservaNaoRealizada = JsonConvert.DeserializeObject<ReservaNaoRealizadaEvent>(events[0].Event.Data.ToString());
                return BadRequest(new ResponseMessageDTO(String.Format("Operation failed due to {0}", reservaNaoRealizada.razao)));
            }

            return Accepted(new ResourceDTO(String.Format("/commands/{0}", streamId)));
        }

        [HttpPost]
        public ActionResult<PedidoReservaDTO> CreateReserva(PedidoReservaDTO reserva)
        {
            _logger.LogDebug(" -- Create Reserva -- ");
            var streamId = _reservaService.CreateReserva(reserva);

            return Accepted(new ResourceDTO(String.Format("/commands/{0}", streamId)));
        }
    }
}
