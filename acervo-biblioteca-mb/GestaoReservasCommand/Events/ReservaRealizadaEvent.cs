

namespace GestaoReservasCommand.Event
{
    public class ReservaRealizadaEvent : BaseEvent
    {
        public long reservaId { get; set; }

        public ReservaRealizadaEvent(long reservaId, string id_stream)
        {
            this.id_stream = id_stream;
            this.reservaId = reservaId;
        }

    }
}