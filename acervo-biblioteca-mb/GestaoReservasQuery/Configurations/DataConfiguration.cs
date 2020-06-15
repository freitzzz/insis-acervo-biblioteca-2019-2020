
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using GestaoReservasQuery.Repositories;

namespace GestaoReservasQuery.Configurations
{
    public enum DataProviderEnum
    {
        InMemory = 0,
        SQLite = 1,
        SQLServer = 2

    }
    public class DataConfiguration
    {
        public static void configure(DataProviderEnum provider, IConfiguration configuration, IServiceCollection services)
        {
            switch (provider)
            {
                case DataProviderEnum.InMemory:
                    addInMemory(configuration, services);
                    break;
                case DataProviderEnum.SQLite:
                    addSqlite(configuration, services);
                    break;
                case DataProviderEnum.SQLServer:
                    addSqlServer(configuration, services);
                    break;
            }
            useEntityFramework(configuration, services);
        }

        private static void addInMemory(IConfiguration configuration, IServiceCollection services)
        {
            services.AddDbContext<GestaoReservasQueryContext>(options =>
                   options.UseInMemoryDatabase("GestaoReservasQueryDB"));
        }

        private static void addSqlite(IConfiguration configuration, IServiceCollection services)
        {
            services.AddDbContext<GestaoReservasQueryContext>(options =>
                   options.UseSqlite(configuration.GetConnectionString("GestaoReservasQueryContext")));
        }

        private static void addSqlServer(IConfiguration configuration, IServiceCollection services)
        {
            services.AddDbContext<GestaoReservasQueryContext>(options =>
                   options.UseSqlServer(configuration.GetConnectionString("GestaoReservasQueryContextSQLSERVER")));
        }

        private static void useEntityFramework(IConfiguration configuration, IServiceCollection services)
        {
            // AddScoped(): These services are created once per request.
            // AddTransient(): These services are created each time they are requested.
            // AddSingleton(): These services are created first time they are requested and stay the same for subsequence requests.

            services.AddTransient<IReservaRepository, ReservaRepository>();
            services.AddTransient<IReservaSpecification, ReservaSpecification>();
        }
    }
}
