using System.Collections.Generic;
using System.Linq;
using GestaoReservasQuery.Model;
using GestaoReservasQuery.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GestaoReservasQuery.Repositories
{
    public class ReservaRepository : Repository<Reserva>, IReservaRepository
    {
        public ReservaRepository(GestaoReservasQueryContext context) : base(context) { }

        public override Reserva GetById(long id)
        {
            return this.GetQueryable().Include(r => r.obra).FirstOrDefault(e => e.Id == id);
        }
    }
}