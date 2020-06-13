using System;
using System.Collections.Generic;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GestaoReservasQuery.Controllers
{
    [ApiController]
    [Route("reserva")]
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
        public ActionResult<ListReservaDTO> GetReservaInPeriodo([FromQuery] String dataInicio, [FromQuery] String dataFim, [FromQuery] String obra)
        {
            _logger.LogDebug(" -- GetReservaInPeriodo -- ");
            List<ReservaDTO> lista = _reservaService.GetReservasInPeriodo(dataInicio, dataFim, obra);
            if (lista != null & lista.Count != 0)
            {
                return Ok(new ListReservaDTO(lista));
            }
            return NotFound();
        }

        [HttpGet("utente/{utente}")]
        public ActionResult<ReservaDTO> GetReserva([FromQuery] String dataInicio, [FromQuery] String dataFim, [FromQuery] String obra, [FromRoute] String utente)
        {
            _logger.LogDebug(" -- GetReserva -- ");
            ReservaDTO reserva = _reservaService.GetReserva(dataInicio, dataFim, obra, utente);
            if (reserva != null)
            {
                return Ok(reserva);
            }
            return NotFound();
        }

        [HttpPost]
        public ActionResult<ReservaDTO> AddReserva([FromBody] ReservaDTO reserva)
        {
            _logger.LogDebug(" -- AddReserva -- ");
            bool added = _reservaService.AddReserva(reserva);
            if (added)
            {
                return Ok(reserva);
            }
            return BadRequest();
        }
    }
}
