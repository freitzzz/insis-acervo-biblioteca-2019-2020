
using System;

namespace GestaoReservasCommand.DTO
{
    public class ObraDTO : BaseEntityDTO
    {
        public string titulo { get; set; }
        public int estado { get; set; }
        public string polo { get; set; }

        public ObraDTO() { }
        public ObraDTO(string titulo, int estado, string polo)
        {
            this.titulo = titulo;
            this.estado = estado;
            this.polo = polo;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            return obj is ObraDTO dTO &&
                   titulo == dTO.titulo &&
                   estado == dTO.estado &&
                   polo == dTO.polo;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(titulo, estado, polo);
        }
    }
}