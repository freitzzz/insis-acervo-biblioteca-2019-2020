using System;

namespace GestaoReservasQuery.Model
{
    public class Reserva : BaseEntity
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public Obra obra { get; set; }
        public string estado { get; set; }

        public Reserva() { }
    }

    public enum ReservaEstado 
    {
        NaoCumprida = 0,
        EmEspera = 1,
        Cumprida = 2,
        Cancelada = 3
    }
}