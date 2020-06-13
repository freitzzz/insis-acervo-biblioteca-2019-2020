using System.Collections.Generic;

namespace GestaoReservasCommand.DTO
{
    public class ListReservaDTO : BaseEntityDTO
    {
        public List<ReservaDTO> lista { get; set; }

        public ListReservaDTO(){}
    }
}