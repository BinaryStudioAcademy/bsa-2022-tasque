using Tasque.Core.Common.Models.Events;

namespace Tasque.Messaging.Abstractions
{
    public interface IIntegrationEventHandler<TIntegrationEvent> where TIntegrationEvent : IntegrationEvent
    {
        Task Handle(TIntegrationEvent @event);
    }
}
