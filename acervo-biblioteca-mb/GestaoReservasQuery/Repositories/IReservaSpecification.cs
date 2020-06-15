using System;
using System.Linq.Expressions;
using GestaoReservasQuery.Model;
using GestaoReservasQuery.Repositories;

namespace GestaoReservasQuery.Repositories
{
    public interface IReservaSpecification : ISpecification<Reserva>
    {
        IReservaSpecification ReservaInPeriodoOfObra(DateTime dataInicio, DateTime dataFim, string obra);
        IReservaSpecification ReservaInPeriodoOfObraOfUtente(DateTime dataInicio, DateTime dataFim, string obra, string utente);
    }
}