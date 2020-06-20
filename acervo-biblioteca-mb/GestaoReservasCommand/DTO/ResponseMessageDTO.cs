using System;

namespace GestaoReservasCommand.DTO
{
    public class ResponseMessageDTO 
    {
        public string message { get; set; }
        
        public ResponseMessageDTO(){}
        public ResponseMessageDTO(string message){
            this.message = message;
        }
    }
}