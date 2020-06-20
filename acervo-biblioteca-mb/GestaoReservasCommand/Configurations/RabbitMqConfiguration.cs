using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GestaoReservasCommand.Configurations
{
    
    public class RabbitMqConfiguration
    {
        public string Hostname { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public static void configure(IConfiguration configuration, IServiceCollection services)
        {
            useDefault(configuration, services);
        }

        private static void useDefault(IConfiguration configuration, IServiceCollection services)
        {
            services.Configure<RabbitMqConfiguration>(configuration.GetSection("RabbitMq"));
        }
    }
}