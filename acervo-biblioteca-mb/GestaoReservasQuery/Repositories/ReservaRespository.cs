using GestaoReservasQuery.Model;
using GestaoReservasQuery.Repositories;

namespace GestaoReservasQuery.Repositories
{
    public class ReservaRepository : Repository<Reserva>, IReservaRepository
    {
        public ReservaRepository(GestaoReservasQueryContext context) : base(context) { }
    }
}