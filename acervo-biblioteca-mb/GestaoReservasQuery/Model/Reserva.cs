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
        public Reserva(string utente, DateTime dataInicio, DateTime dataFim, Obra obra, string estado)
        {
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
            this.estado = estado;
        }
    }

    public enum ReservaEstado
    {
        NaoCumprida = 0,
        EmEspera = 1,
        Cumprida = 2,
        Cancelada = 3
    }
}