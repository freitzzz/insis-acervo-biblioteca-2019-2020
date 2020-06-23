

namespace GestaoReservasQuery.Event
{
    public class ReservaRealizadaEvent : BaseEvent
    {
        public long reservaId { get; set; }

        public ReservaRealizadaEvent(long reservaId, string streamId)
        {
            this.streamId = streamId;
            this.reservaId = reservaId;
        }

    }
}