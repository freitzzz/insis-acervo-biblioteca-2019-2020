using System;

namespace GestaoReservasCommand.Event
{
    public class ReservaRecebidaEvent : BaseEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }
        
        public ReservaRecebidaEvent(){}
        public ReservaRecebidaEvent(string utente, DateTime dataInicio, DateTime dataFim, string obra){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
        }
    }
}