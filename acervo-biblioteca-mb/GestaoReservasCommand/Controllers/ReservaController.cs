using System;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GestaoReservasCommand.Controllers
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
        public string CreateGet()
        {
            _logger.LogDebug(" -- TO BE REMOVED -- ");
            DateTime date = DateTime.Now;
            return date.ToString();
        }


        [HttpPost]
        public ActionResult<ReservaDTO> CreateReserva(ReservaDTO reserva)
        {
            _logger.LogDebug(" -- Create Reserva -- ");
            _reservaService.CreateReserva(reserva);

            return Ok(reserva);
        }
    }
}
