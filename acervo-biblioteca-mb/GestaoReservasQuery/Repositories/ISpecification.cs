using System;
using System.Linq.Expressions;

namespace GestaoReservasQuery.Repositories
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria { get; }
        Expression<Func<T, object>> Include { get; }
    }
}