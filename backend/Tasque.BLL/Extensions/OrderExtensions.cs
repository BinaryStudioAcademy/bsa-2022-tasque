using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.BLL.Extensions;
public static class OrderExtensions
{
    public static void SetOrder(this IEnumerable<OrderableEntity> entities, IEnumerable<int> ids)
    {
        var idsCount = ids.Count();
        foreach (var obj in entities)
        {
            obj.Order = idsCount + 1;
        }

        for (int i = 0; i < idsCount; i++)
        {
            var entity = entities.SingleOrDefault(x => x.Id == ids.ElementAt(i));
            if (entity == null) continue;
            entity.Order = i;
        }
    }
}
