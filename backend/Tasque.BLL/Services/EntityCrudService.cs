using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public abstract class EntityCrudService<TEntity> where TEntity : BaseEntity
    {
        private readonly DataContext _db;
        public EntityCrudService(DataContext db)
        {
            _db = db;
        }

        public TEntity Create(TEntity entity)
        {
            _db.Set<TEntity>().Add(entity);
            _db.SaveChanges();
            return entity;
        }

        public TEntity? ReadOne(int id)
        {
            var entity = _db.Set<TEntity>().FirstOrDefault(entity => entity.Id == id);
            return entity;
        }

        public IEnumerable<TEntity> ReadAll()
        {
            return _db.Set<TEntity>().ToList();
        }

        public TEntity Update(TEntity entity)
        {
            _db.Set<TEntity>().Update(entity);
            return entity;
        }

        public bool Delete(int id)
        {
            var entityToDelete = ReadOne(id);
            if (entityToDelete is null)
            {
                return false;
            }
            _db.Set<TEntity>().Remove(entityToDelete);
            return true;
        }
    }
}
