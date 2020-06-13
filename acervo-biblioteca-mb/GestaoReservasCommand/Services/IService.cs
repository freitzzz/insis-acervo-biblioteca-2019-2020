using GestaoReservasCommand.DTO;
using GestaoReservasCommand.Model;

namespace GestaoReservasCommand.Services{
    public interface IService<Entity, DTO> where Entity : BaseEntity where DTO : BaseEntityDTO
    {
        
    }
}