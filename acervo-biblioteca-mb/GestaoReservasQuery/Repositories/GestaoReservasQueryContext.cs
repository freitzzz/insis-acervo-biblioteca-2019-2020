using Microsoft.EntityFrameworkCore;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Repositories
{
    public class GestaoReservasQueryContext : DbContext
    {

        public GestaoReservasQueryContext(DbContextOptions<GestaoReservasQueryContext> options) : base(options)
        { }
        
        public DbSet<Reserva> Reservas { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
