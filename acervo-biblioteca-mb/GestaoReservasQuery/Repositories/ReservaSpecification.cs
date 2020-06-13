using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq.Expressions;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Repositories
{
    public class ReservaSpecification : IReservaSpecification
    {
        public Expression<Func<Reserva, bool>> Criteria { get; set; }
        public Expression<Func<Reserva, object>> Include { get; set; }

        public IReservaSpecification ReservaInPeriodoOfObra(DateTime dataInicio, DateTime dataFim, string obra)
        {
            // Expression<Func<Reserva, bool>> periodo = OfUtente(obra);
            // Expression<Func<Reserva, bool>> ofObra = OfObra(obra);
            // var parameter = Expression.Parameter(typeof(Reserva), "r");
    
            // Criteria = Expression.Lambda<Func<Reserva, bool>>(Expression.AndAlso(periodo.Body, ofObra.Body), parameter);
            Criteria = r => (r.dataInicio.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0)
                        || r.dataFim.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0))
                        && (r.obra == obra);
                        
            return this;
        }

        public IReservaSpecification ReservaInPeriodoOfObraOfUtente(DateTime dataInicio, DateTime dataFim, string obra, String utente)
        {
            // Criteria = Expression.Lambda<Func<Reserva, bool>>(Expression.AndAlso(InPeriodo(dataInicio, dataFim), OfObra(obra)));
            // Criteria = Expression.Lambda<Func<Reserva, bool>>(Expression.AndAlso(Criteria, OfUtente(utente)));
            Criteria = r => (r.dataInicio.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0)
                        || r.dataFim.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0))
                        && (r.obra == obra)
                        && (r.utente == utente);
                        
            return this;
        }

        private Expression<Func<Reserva, bool>> InPeriodo(string dataInicio, string dataFim)
        {
            Criteria = r => (r.dataInicio.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0)
                        || r.dataFim.CompareTo(dataInicio) >= 0 && (r.dataInicio.CompareTo(dataFim) <= 0));
            return Criteria;
        }

        private Expression<Func<Reserva, bool>> OfObra(string obra)
        {
            Criteria = r => (r.obra == obra);
            return Criteria;
        }

        private Expression<Func<Reserva, bool>> OfUtente(string utente)
        {
            Criteria = r => (r.utente == utente);
            return Criteria;
        }
    }
}