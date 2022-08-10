using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.BLL.Services
{
    public interface IEntityCrudService<TEntity> where TEntity : BaseEntity
    {
        TEntity Create(TEntity entity);
        bool Delete(int id);
        IEnumerable<TEntity> GetAll();
        TEntity? GetOne(int id);
        TEntity Update(TEntity entity);
    }
}
