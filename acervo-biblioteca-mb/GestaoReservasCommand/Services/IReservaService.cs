using EventStore.ClientAPI;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Model;

namespace GestaoReservasCommand.Services
{
    public interface IReservaService : IService<Reserva, ReservaDTO>
    {
        string CreateReserva(ReservaDTO dto);
        ResolvedEvent[] GetStreamInfo(string streamId);
    }
}
