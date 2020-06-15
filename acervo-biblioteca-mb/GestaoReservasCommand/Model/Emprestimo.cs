using System;
namespace GestaoReservasCommand.Model
{
    public class Emprestimo : BaseEntity
    {
        public string utente { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFim { get; set; }
        public string obra { get; set; }

        public Emprestimo(){}
    }
}