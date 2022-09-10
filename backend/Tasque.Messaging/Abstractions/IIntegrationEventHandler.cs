using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Models;

namespace Tasque.Messaging.Abstractions
{
    public interface IIntegrationEventHandler<TIntegrationEvent> where TIntegrationEvent : IntegrationEvent
    {
        Task Handle(TIntegrationEvent @event);
    }
}
