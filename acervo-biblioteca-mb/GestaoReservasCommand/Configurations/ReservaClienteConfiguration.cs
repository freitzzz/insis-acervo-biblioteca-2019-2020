using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GestaoReservasCommand.Configurations
{
    
    public class ReservaClienteConfiguration
    {
        public string URL { get; set; }

        public static void configure(IConfiguration configuration, IServiceCollection services)
        {
            useDefault(configuration, services);
        }

        private static void useDefault(IConfiguration configuration, IServiceCollection services)
        {
            services.Configure<ReservaClienteConfiguration>(configuration.GetSection("ReservaClient"));
        }
    }
}