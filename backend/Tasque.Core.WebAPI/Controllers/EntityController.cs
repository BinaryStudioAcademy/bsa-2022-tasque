using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;

namespace Tasque.Core.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    public abstract class EntityController<TCreateDto, TInfoDto, TUpdateDto, TKey, TService> : ControllerBase
        where TService : class, IBaseService<TCreateDto, TInfoDto, TUpdateDto, TKey>
    {
        protected readonly TService _service;
        
        public EntityController(TService service)
        {
            _service = service;
        }

        [Route("create")]
        [HttpPost]
        public virtual async Task<IActionResult> Create([FromBody] TCreateDto entityDTO)
        {
            var entity = await _service.Create(entityDTO);

            return Ok(entity);
        }

        [Route("getById/{key}")]
        [HttpGet]
        public virtual async Task<IActionResult> GetById(TKey key)
        {
            var entity = await _service.GetByKey(key);

            return Ok(entity);
        }


        [Route("update/{key}")]
        [HttpPut]
        public virtual async Task<IActionResult> Update(
            TKey key,
            [FromBody] TUpdateDto updateDto)
        {
            var entity = await _service.Update(key, updateDto);

            return Ok(entity);
        }

        [Route("delete/{key}")]
        [HttpDelete]
        public virtual async Task<IActionResult> Delete(TKey key)
        {
            var deleted = await _service.Delete(key);

            return deleted ? NoContent() : BadRequest();
        }
    }
}
