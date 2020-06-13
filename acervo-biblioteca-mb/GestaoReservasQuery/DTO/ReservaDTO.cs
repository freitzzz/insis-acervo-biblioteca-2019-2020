using System;

namespace GestaoReservasQuery.DTO
{
    public class ReservaDTO : BaseEntityDTO
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }

        public ReservaDTO(){}
        public ReservaDTO(String utente, DateTime dataInicio, DateTime dataFim, String obra){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
        }
    }
}