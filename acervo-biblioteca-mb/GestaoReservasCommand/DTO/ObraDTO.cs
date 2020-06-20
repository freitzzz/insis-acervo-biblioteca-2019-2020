
namespace GestaoReservasCommand.DTO
{
    public class ObraDTO : BaseEntityDTO
    {
        public string titulo { get; set; }
        public int estado { get; set; }
        public string polo { get; set; }

        public ObraDTO(){}
    }
}