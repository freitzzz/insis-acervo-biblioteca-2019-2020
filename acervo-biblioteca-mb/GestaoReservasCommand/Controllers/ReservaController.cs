using System;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Events;
using GestaoReservasCommand.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

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

            if (events[0].Event.EventStreamId.Equals(streamId))
                return Accepted(new ResourceDTO(String.Format("/commands/{0}", streamId)));

            // TODO - Corrigir "/reservas/{0}", streamId
            if (events[0].Event.EventType.Equals("reserva_aceite"))
                return Accepted(new ResourceDTO(String.Format("/reservas/{0}", streamId)));

            // TODO - acho que falta coisas
            return Accepted(new ResourceDTO(String.Format("/reservas/{0}", streamId)));
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
