using System;

namespace GestaoReservasCommand.DTO
{
    public class ResourceDTO 
    {
        public string url { get; set; }
        
        public ResourceDTO(){}
        public ResourceDTO(string url){
            this.url = url;
        }
    }
}