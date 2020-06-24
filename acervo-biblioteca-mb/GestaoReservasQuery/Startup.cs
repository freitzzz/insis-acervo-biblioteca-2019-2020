using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AutoMapper;
using GestaoReservasQuery.Configurations;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace GestaoReservasQuery
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddMvc();

            services.AddControllers();
            services.AddAutoMapper(typeof(Startup));

            int chosenDB = Configuration.GetValue("ChosenDB", 1);
            DataConfiguration.configure((DataProviderEnum)chosenDB, Configuration, services);

            ServiceConfiguration.configure(Configuration, services);
            RabbitMqConfiguration.configure(Configuration, services);

            services.AddCors();

            // ********************
            // Setup CORS
            // ********************
            // var corsBuilder = new CorsPolicyBuilder();
            // corsBuilder.AllowAnyHeader();
            // corsBuilder.AllowAnyMethod();
            // corsBuilder.AllowAnyOrigin(); // For anyone access.
            // //corsBuilder.WithOrigins("http://localhost:56573"); // for a specific url. Don't add a forward slash on the end!
            // corsBuilder.AllowCredentials();

            // services.AddCors(options =>
            // {
            //     options.AddPolicy("SiteCorsPolicy", corsBuilder.Build());
            // });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            //app.UseMvc();


            // ********************
            // USE CORS - might not be required.
            // ********************
            // app.UseCors("SiteCorsPolicy");
        }
    }
}
