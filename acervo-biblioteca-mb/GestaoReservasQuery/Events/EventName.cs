namespace GestaoReservasQuery.Events
{
    public class EventName
    {
        private EventName(string value) { Value = value; }

        public string Value { get; set; }

        // Pedido de Reserva
        public static EventName ReservaAceite { get { return new EventName("reserva_aceite"); } }
        public static EventName ReservaNaoRealizada { get { return new EventName("reserva_nao_realizada"); } }
        public static EventName ReservaRealizada { get { return new EventName("reserva_realizada"); } }

    }
}