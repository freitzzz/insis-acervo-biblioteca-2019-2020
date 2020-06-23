using System;
using System.Collections.Generic;
using GestaoReservasCommand.DTO;

namespace GestaoReservasCommand.Event
{
    public class EmprestimoNaoSobrepostoEvent : BaseEvent
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }
        public List<ObraDTO> obrasSemEmprestimo { get; set; }

        public EmprestimoNaoSobrepostoEvent() { }
        public EmprestimoNaoSobrepostoEvent(string utente, DateTime dataInicio, DateTime dataFim, string obra, List<ObraDTO> obrasSemEmprestimo)
        {
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
            this.obrasSemEmprestimo = obrasSemEmprestimo;
        }
    }
}