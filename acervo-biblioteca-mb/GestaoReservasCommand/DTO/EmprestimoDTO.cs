using System;

namespace GestaoReservasCommand.DTO
{
    public class EmprestimoDTO : BaseEntityDTO
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }

        public EmprestimoDTO(){}
    }
}