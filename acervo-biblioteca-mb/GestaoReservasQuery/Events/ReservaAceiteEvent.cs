using System;
using GestaoReservasQuery.DTO;

namespace GestaoReservasQuery.Event
{
    public class ReservaAceiteEvent : BaseEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public ObraDTO obra { get; set; }
        public ReservaAceiteEvent(string utente, DateTime dataInicio, DateTime dataFim, ObraDTO obra, string id_stream)
        {
            this.id_stream = id_stream;
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
        }

    }
}