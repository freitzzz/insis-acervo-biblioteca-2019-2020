using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;

namespace GestaoReservasQuery.Services{
    public interface IService<Entity, DTO> where Entity : BaseEntity where DTO : BaseEntityDTO
    {
        
    }
}