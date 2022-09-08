using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models;
using Tasque.Messaging.Abstractions;

namespace Tasque.Messaging.SubscriptionManagement
{
    public interface ISubscriptionsManager
    {
        bool IsEmpty { get; }
        event EventHandler<string> OnEventRemoved;

        void AddSubscription<TEvent, THandler>() where TEvent : IntegrationEvent where THandler : IIntegrationEventHandler<TEvent>;
        void RemoveSubscription<TEvent, THandler>() where TEvent : IntegrationEvent where THandler : IIntegrationEventHandler<TEvent>;
        bool HasSubscriptionsForEvent<TEvent>() where TEvent : IntegrationEvent;
        bool EventHasSubscribers(string eventName);
        Type GetEventTypeByName(string eventName);
        void Clear();
        IEnumerable<SubscriptionInfo> GetHandlersForEvent<TEvent>() where TEvent : IntegrationEvent;
        IEnumerable<SubscriptionInfo> GetHandlersForEvent(string eventName);
        string GetEventKey<TEvent>();
    }
}
