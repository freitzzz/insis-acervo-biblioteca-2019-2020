using AutoMapper;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Configurations.AutoMapper
{
    public class DtoToDomainMappingProfile : Profile
    {
        public DtoToDomainMappingProfile()
        {
            CreateMap<ReservaDTO, Reserva>();
        }

    }
}
