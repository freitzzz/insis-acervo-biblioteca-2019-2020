using System;

namespace GestaoReservasCommand.Event
{
    public abstract class BaseEvent
    {
        public string streamId { get; set; }

        // public Boolean State { get; set; } = true;
    }
}