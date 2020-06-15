using AutoMapper;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Configurations.AutoMapper
{
    public class DomainToDtoMappingProfile : Profile
    {
        public DomainToDtoMappingProfile()
        {
            CreateMap<Reserva, ReservaDTO>();
        }
    }
}