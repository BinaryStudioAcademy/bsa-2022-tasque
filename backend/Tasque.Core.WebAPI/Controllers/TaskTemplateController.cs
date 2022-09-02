﻿using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task.TemplateModels;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskTemplateController : ControllerBase
    {
        private readonly ICosmosTemplateService _service;
        public TaskTemplateController(ICosmosTemplateService service) => _service = service;

        [HttpGet("all/{projectId}")]
        public async Task<IActionResult> GetAllProjectTemplates(string projectId)
        {
            var templates = await _service.GetAllProjectTemplates(projectId);
            if (templates == null)
                return BadRequest($"{nameof(TaskTemplate)} not found");
            return Ok(templates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplate(string id)
        {
            var template = await  _service.GetTemplateById(id);
            if (template == null)
                return NotFound($"{nameof(TaskTemplate)} not found");
            return Ok(template);
        }

        [HttpPost("saveTemplate")]
        public async Task<IActionResult> Createtemplate([FromBody] TaskTemplate value)
        {
            var template = await _service.CreateTemplate(value);
            if (template == null)
                return BadRequest($"Unexpected problem ocured");
            return Created(template.ToString()?? string.Empty, template);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTemplate([FromBody] TaskTemplate value)
        {
            var template = await _service.UpdateTemplate(value);
            if (template == null)
                return BadRequest($"Unexpected problem ocured");
            return Ok(template);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(string id)
        {
            await _service.DeleteTemplate(id);
            return NoContent();
        }
    }
}
