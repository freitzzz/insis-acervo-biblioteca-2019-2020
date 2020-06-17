using System;

namespace GestaoReservasQuery.Model
{
    public class Obra : BaseEntity
    {
        public string titulo { get; set; }
        public int estado { get; set; }
        public string polo { get; set; }

        public Obra(){}
    }
}