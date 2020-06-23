using System;
using System.Collections.Generic;
using GestaoReservasCommand.DTO;

namespace GestaoReservasCommand.Event
{
    public class ExisteReservaEvent : BaseEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }
        public List<ObraDTO> obrasReservadas { get; set; }
        public ExisteReservaEvent(string utente, DateTime dataInicio, DateTime dataFim, string obra, List<ObraDTO> obrasReservadas, string streamId)
        {
            this.streamId = streamId;
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
            this.obrasReservadas = obrasReservadas;
        }

    }
}