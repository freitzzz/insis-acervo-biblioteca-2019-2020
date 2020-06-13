using System.Collections.Generic;

namespace GestaoReservasQuery.DTO
{
    public class ListReservaDTO : BaseEntityDTO
    {
        public List<ReservaDTO> lista { get; set; }

        public ListReservaDTO() { }
        public ListReservaDTO(List<ReservaDTO> lista)
        {
            this.lista = lista;
        }
    }
}