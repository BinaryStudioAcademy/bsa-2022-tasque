using Newtonsoft.Json;

namespace Tasque.Core.Common.Models.Events
{
    public class IntegrationEvent
    {
        public IntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreationDate = DateTime.UtcNow;
        }
        public IntegrationEvent(Guid id, DateTime createDate)
        {
            Id = id;
            CreationDate = createDate;
        }
        public Guid Id { get; private set; }
        public DateTime CreationDate { get; private set; }
        public string ConnectionId { get; set; }
    }
}
