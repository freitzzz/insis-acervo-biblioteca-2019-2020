using System;
using System.Collections.Generic;
using GestaoReservasCommand.DTO;

namespace GestaoReservasCommand.Event
{
    public class ExisteReservaEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }
        public List<ReservaDTO> listaReservas { get; set; }
        public ExisteReservaEvent(String utente, DateTime dataInicio, DateTime dataFim, String obra, List<ReservaDTO> listaReservas){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
            this.listaReservas = listaReservas;
        }

    }
}