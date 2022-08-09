﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.WebAPI.Controllers
{
    [ApiController]
    public abstract class EntityController<TModel, TDto, TService> : ControllerBase
        where TModel : BaseEntity
        where TDto : class
        where TService : IEntityCrudService<TModel>
    {
        private readonly TService _service;
        private readonly Mapper mapper;
        public EntityController(TService service)
        {
            _service = service;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TDto, TModel>().ReverseMap());
            mapper = new Mapper(config);
        }

        [Route("readOne/{id}")]
        [HttpGet]
        public async Task<IActionResult> ReadOne(int id)
        {
            var entity = _service.ReadOne(id);
            if (entity is not null)
            {
                return Ok(entity);
            }
            else
            {
                return BadRequest("Entity not found");
            }
        }

        [Route("readAll")]
        [HttpGet]
        public IActionResult ReadAll()
        {
            var entities = _service.ReadAll();
            return Ok(entities);
        }

        [Route("create")]
        [HttpPost]
        public IActionResult Create([FromBody] TDto entityDTO)
        {
            var entity = mapper.Map<TModel>(entityDTO);
            _service.Create(entity);
            return Ok(entity);
        }

        [Route("update/{id}")]
        [HttpPut]
        public IActionResult Update(int id, [FromBody] TDto entityDTO)
        {
            var entity = mapper.Map<TModel>(entityDTO);
            entity.Id = id;
            _service.Update(entity);
            return Ok(entity);
        }

        [Route("delete/{id}")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var deleted = _service.Delete(id);
            if (deleted)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
