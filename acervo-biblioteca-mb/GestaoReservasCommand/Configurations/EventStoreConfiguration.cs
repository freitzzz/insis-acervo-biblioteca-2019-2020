using GestaoReservasCommand.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace GestaoReservasCommand.Configurations
{

    public class EventStoreConfiguration
    {
        public string URL { get; set; }

        public static void configure(IConfiguration configuration, IServiceCollection services)
        {
            useDefault(configuration, services);
        }

        private static void useDefault(IConfiguration configuration, IServiceCollection services)
        {
            services.Configure<EventStoreConfiguration>(configuration.GetSection("EventStore"));

            services.AddTransient<IEventStoreHandler, Services.EventStoreHandler>();
        }
    }
}