using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using GestaoReservasCommand.Services;

namespace GestaoReservasCommand.Configurations
{
    public class ServiceConfiguration
    {
        public static void configure(IConfiguration configuration, IServiceCollection services)
        {
            useDefault(configuration, services);
        }

        private static void useDefault(IConfiguration configuration, IServiceCollection services)
        {
            services.AddTransient<IReservaService, ReservaService>();
            services.AddTransient<IEmprestimoService, EmprestimoService>();
        }
    }
}