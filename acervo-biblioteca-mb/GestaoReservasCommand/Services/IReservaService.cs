using System;
using System.Collections.Generic;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Model;

namespace GestaoReservasCommand.Services
{
    public interface IReservaService : IService<Reserva, PedidoReservaDTO>
    {
        string CreateReserva(PedidoReservaDTO dto);
        bool ContainsStream(string streamId);
        string ContainsEvent(string streamId, string eventName);
        void ValidateReserva(DateTime dataInicio, DateTime dataFim, string obra, string utente, string streamId, List<ObraDTO> obrasAutorizadas, List<ObraDTO> obrasSemEmprestimo);
    }
}
