using EventStore.ClientAPI;
using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Model;

namespace GestaoReservasCommand.Services
{
    public interface IReservaService : IService<Reserva, PedidoReservaDTO>
    {
        string CreateReserva(PedidoReservaDTO dto);
        ResolvedEvent[] GetStreamInfo(string streamId);
    }
}
