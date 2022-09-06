using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [ApiController]
    [Authorize]
    public abstract class EntityController<TModel, TDto, TService> : ControllerBase
        where TModel : BaseEntity
        where TDto : class
        where TService : IEntityCrudService<TModel>
    {
        protected readonly TService _service;
        protected readonly IMapper mapper;
        //TODO: Get mapper from DI container instead of creating it locally
        protected readonly IMapper? diMapper;
        protected readonly CurrentUserParameters _currentUser;

        public EntityController(TService service, CurrentUserParameters currentUser, IMapper? diMapper = null)
        {
            _service = service;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TDto, TModel>().ReverseMap());
            mapper = new Mapper(config);
            this.diMapper = diMapper;
            _currentUser = currentUser;
        }

        [Route("getById/{id}")]
        [HttpGet]
        public virtual IActionResult GetById(int id)
        {
            var entity = _service.GetById(id);
            if (entity is not null)
            {
                return Ok(entity);
            }
            else
            {
                return BadRequest("Entity not found");
            }
        }

        [Route("create")]
        [HttpPost]
        public virtual IActionResult Create([FromBody] TDto entityDTO)
        {
            var entity = mapper.Map<TModel>(entityDTO);
            _service.Create(entity);
            return Ok(entity);
        }

        [Route("update/{id}")]
        [HttpPut]
        public virtual IActionResult Update(int id, [FromBody] TDto entityDTO)
        {
            var entity = mapper.Map<TModel>(entityDTO);
            entity.Id = id;
            _service.Update(entity);
            return Ok(entity);
        }

        [Route("delete/{id}")]
        [HttpDelete]
        public virtual IActionResult Delete(int id)
        {
            var deleted = _service.Delete(id);
            return deleted ? Ok() : BadRequest();
        }
    }
}
