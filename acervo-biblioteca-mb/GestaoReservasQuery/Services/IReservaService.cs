using System;
using System.Text;
using System.Collections.Generic;
using GestaoReservasQuery.Configurations;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Services
{
    public interface IReservaService : IService<Reserva, ReservaDTO>
    {
        bool AddReserva(ReservaDTO dto);
        List<ReservaDTO> GetReservasInPeriodo(String dataInicio, String dataFim, String obra);
        ReservaDTO GetReserva(String dataInicio, String dataFim, String obra, String utente);
    }
}
