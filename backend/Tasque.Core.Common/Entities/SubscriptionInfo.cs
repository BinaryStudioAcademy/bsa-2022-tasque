namespace Tasque.Core.Common.Entities
{
    public class SubscriptionInfo
    {
        public Type HandlerType { get; }
        public SubscriptionInfo(Type handlerType)
        {
            HandlerType = handlerType;
        }
    }
}
