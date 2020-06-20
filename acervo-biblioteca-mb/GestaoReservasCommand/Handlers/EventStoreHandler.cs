using System;
using Microsoft.Extensions.Options;
using GestaoReservasCommand.Configurations;
using EventStore.ClientAPI;
using System.Text;

namespace GestaoReservasCommand.Services
{
    public class EventStoreHandler : IEventStoreHandler
    {
        private IEventStoreConnection connection;

        public EventStoreHandler(IOptions<EventStoreConfiguration> eventStoreConfiguration)
        {
            if (connection == null)
            {
                connection = EventStoreConnection.Create(new Uri(eventStoreConfiguration.Value.URL));
                connection.ConnectAsync().Wait();
            }
        }

        public void AddEvent(string streamName, string eventType, string data, string metadata)
        {

            var eventPayload = new EventData(Guid.NewGuid(), eventType, true, Encoding.UTF8.GetBytes(data), Encoding.UTF8.GetBytes(metadata));
            connection.AppendToStreamAsync(streamName, ExpectedVersion.Any, eventPayload).Wait();
        }

        public ResolvedEvent[] GetEvents(string streamName)
        {
            var readEvents = connection.ReadStreamEventsForwardAsync(streamName, 0, 10, true).Result;
            return readEvents.Events;
        }

        public ResolvedEvent[] GetLastEvent(string streamName)
        {
            var readEvents = connection.ReadStreamEventsForwardAsync(streamName, StreamPosition.End + 1, 1, true).Result;
            return readEvents.Events;
        }
    }
}