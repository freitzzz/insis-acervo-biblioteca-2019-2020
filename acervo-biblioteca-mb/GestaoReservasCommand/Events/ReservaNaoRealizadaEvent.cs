

namespace GestaoReservasCommand.Event
{
    public class ReservaNaoRealizadaEvent : BaseEvent
    {
        public string razao { get; set; }

        public ReservaNaoRealizadaEvent(string razao, string streamId)
        {
            this.streamId = streamId;
            this.razao = razao;
        }

    }
}