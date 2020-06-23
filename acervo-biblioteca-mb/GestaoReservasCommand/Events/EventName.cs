namespace GestaoReservasCommand.Events
{
    public class EventName
    {
        private EventName(string value) { Value = value; }

        public string Value { get; set; }

        // Pedido de Reserva
        public static EventName ReservaRecebida { get { return new EventName("reserva_recebida"); } }
        public static EventName ReservaNaoAceite { get { return new EventName("reserva_nao_aceite"); } }
        public static EventName ReservaAceite { get { return new EventName("reserva_aceite"); } }
        public static EventName ReservaNaoRealizada { get { return new EventName("reserva_nao_realizada"); } }
        public static EventName ReservaRealizada { get { return new EventName("reserva_realizada"); } }
        public static EventName EmprestimoSobreposto { get { return new EventName("emprestimo_sobreposto"); } }
        public static EventName EmprestimoNaoSobreposto { get { return new EventName("emprestimo_nao_sobreposto"); } }
        public static EventName UtenteAutorizado { get { return new EventName("utente_autorizado"); } }
        public static EventName UtenteNaoAutorizado { get { return new EventName("utente_nao_autorizado"); } }

        // Pedido de Emprestimo
        public static EventName EmprestimoRecebido { get { return new EventName("emprestimo_recebido"); } }
        public static EventName ExisteReservaUtente { get { return new EventName("existe_reserva_utente"); } }
        public static EventName ExisteReservas { get { return new EventName("existe_reserva"); } }
        public static EventName NaoExisteReservas { get { return new EventName("nao_existe_reserva"); } }

    }
}