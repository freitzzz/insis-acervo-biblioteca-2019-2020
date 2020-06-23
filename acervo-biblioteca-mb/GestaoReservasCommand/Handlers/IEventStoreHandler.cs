using EventStore.ClientAPI;

namespace GestaoReservasCommand.Services
{
    public interface IEventStoreHandler
    {
        void AddEvent(string stream, string eventType, string data, string metadata);
        ResolvedEvent[] GetEvents(string streamName);
        ResolvedEvent[] GetLastEvent(string streamName);
    }
}