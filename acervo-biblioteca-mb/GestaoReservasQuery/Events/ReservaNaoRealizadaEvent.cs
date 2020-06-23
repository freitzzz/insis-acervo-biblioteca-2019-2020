

namespace GestaoReservasQuery.Event
{
    public class ReservaNaoRealizadaEvent : BaseEvent
    {
        public string razao { get; set; }

        public ReservaNaoRealizadaEvent(string razao, string id_stream)
        {
            this.id_stream = id_stream;
            this.razao = razao;
        }

    }
}