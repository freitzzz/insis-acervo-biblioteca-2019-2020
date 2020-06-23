using System;

namespace GestaoReservasCommand.Event
{
    public abstract class BaseEvent
    {
        public string id_stream { get; set; }

        // public Boolean State { get; set; } = true;
    }
}