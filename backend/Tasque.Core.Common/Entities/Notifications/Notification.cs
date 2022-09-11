using System.ComponentModel.DataAnnotations.Schema;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities.Notifications
{
    public abstract class Notification : BaseEntity
    {
        public abstract string Type { get; } 
    }
}
