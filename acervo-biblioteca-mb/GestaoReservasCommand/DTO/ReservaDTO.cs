using System;

namespace GestaoReservasCommand.DTO
{
    public class ReservaDTO : BaseEntityDTO
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public ObraDTO obra { get; set; }
        public string estado { get; set; }
        
        public ReservaDTO(){}
        public ReservaDTO(String utente, DateTime dataInicio, DateTime dataFim, ObraDTO obra){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
        }
    }
}