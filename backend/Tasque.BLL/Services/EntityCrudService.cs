using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public abstract class EntityCrudService<TEntity> : IEntityCrudService<TEntity> where TEntity : BaseEntity
    {
        private readonly DataContext _db;
        public EntityCrudService(DataContext db)
        {
            _db = db;
        }

        public virtual TEntity Create(TEntity entity)
        {
            _db.Set<TEntity>().Add(entity);
            _db.SaveChanges();
            return entity;
        }

        public TEntity? GetOne(int id)
        {
            var entity = _db.Set<TEntity>().FirstOrDefault(entity => entity.Id == id);
            return entity;
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _db.Set<TEntity>().ToList();
        }

        public virtual TEntity Update(TEntity entity)
        {
            _db.Set<TEntity>().Update(entity);
            return entity;
        }

        public virtual bool Delete(int id)
        {
            var entityToDelete = GetOne(id);
            if (entityToDelete is null)
            {
                return false;
            }
            _db.Set<TEntity>().Remove(entityToDelete);
            return true;
        }
    }
}
