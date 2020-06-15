using System.Collections.Generic;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        T GetById(long id);

        List<T> List();

        List<T> List(ISpecification<T> spec);

        T Add(T entity);

        T Update(T entity);

        T Delete(T entity);
    }
}