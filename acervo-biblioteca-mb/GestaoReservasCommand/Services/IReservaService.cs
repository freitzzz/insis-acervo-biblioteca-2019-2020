using System;
using System.Text;
using GestaoReservasCommand.Configurations;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Model;

namespace GestaoReservasCommand.Services
{
    public interface IReservaService : IService<Reserva, ReservaDTO>
    {
        void CreateReserva(ReservaDTO dto);
    }
}
