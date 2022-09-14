using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public abstract class EntityCrudService<TCreateDto, TInfoDto, TUpdateDto, TKey, TEntity>
        : IBaseService<TCreateDto, TInfoDto, TUpdateDto, TKey>
            where TEntity: class, IBaseEntity
    {
        protected readonly DbSet<TEntity> _dbSet;
        protected readonly DataContext _db;
        protected readonly IMapper _mapper;
        protected readonly int _currentUserId;

        public EntityCrudService(DataContext db, IMapper mapper, CurrentUserParameters currentUser)
        {
            _mapper = mapper;
            _db = db;
            _currentUserId = currentUser.Id;
            _dbSet = db.Set<TEntity>();
        }

        public virtual async Task<TInfoDto> Create(TCreateDto createDto)
        {
            var entityToCreate = _mapper.Map<TEntity>(createDto);

            await _dbSet.AddAsync(entityToCreate);
            await _db.SaveChangesAsync();

            return _mapper.Map<TInfoDto>(entityToCreate);
        }

        public virtual async Task<TInfoDto> GetByKey(TKey key)
        {
            var entity = await _dbSet.FindAsync(key);

            if(entity == null)
            {
                throw new NotFoundHttpException($"{typeof(TEntity).Name} with this key not found");
            }

            return _mapper.Map<TInfoDto>(entity);
        }

        public virtual async Task<TInfoDto> Update(TKey key, TUpdateDto updateDto)
        {
            var entity = await _dbSet.FindAsync(key);

            if(entity is null)
            {
                throw new NotFoundHttpException($"{typeof(TEntity).Name} with this key not found");
            }

            _mapper.Map(updateDto, entity);

            _dbSet.Update(entity);
            await _db.SaveChangesAsync();

            return _mapper.Map<TInfoDto>(entity);
        }

        public virtual async Task<bool> Delete(TKey key)
        {
            var entityToDelete = await _dbSet.FindAsync(key);

            if (entityToDelete is null)
            {
                throw new NotFoundHttpException($"{typeof(TEntity).Name} with this key not found");
            }

            _dbSet.Remove(entityToDelete);
            await _db.SaveChangesAsync();

            return true;
        }
    }
}
