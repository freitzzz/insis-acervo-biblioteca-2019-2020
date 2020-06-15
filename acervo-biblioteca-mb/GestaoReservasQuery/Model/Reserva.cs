using System;

namespace GestaoReservasQuery.Model
{
    public class Reserva : BaseEntity
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }

        public Reserva(){}
    }
}