using System;
using System.Collections.Generic;
using GestaoReservasCommand.DTO;

namespace GestaoReservasCommand.Event
{
    public class UtenteAutorizadoEvent : BaseEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }
        public List<ObraDTO> obrasAutorizadas { get; set; }
        
        public UtenteAutorizadoEvent(){}
        public UtenteAutorizadoEvent(string utente, DateTime dataInicio, DateTime dataFim, string obra, List<ObraDTO> obrasAutorizadas){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
            this.obrasAutorizadas = obrasAutorizadas;
        }
    }
}