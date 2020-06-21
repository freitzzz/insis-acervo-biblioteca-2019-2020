using System;
using GestaoReservasCommand.DTO;

namespace GestaoReservasCommand.DTO
{
    public class PedidoReservaDTO : BaseEntityDTO
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }        
        public PedidoReservaDTO(){}
        public PedidoReservaDTO(String utente, DateTime dataInicio, DateTime dataFim, string obra){
            this.utente = utente;
            this.dataInicio = dataInicio;
            this.dataFim = dataFim;
            this.obra = obra;
        }
    }
}