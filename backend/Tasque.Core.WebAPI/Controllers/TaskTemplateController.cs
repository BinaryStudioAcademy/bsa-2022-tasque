using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task.TemplateModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskTemplateController : ControllerBase
    {
        private readonly ICosmosTemplateService _service;
        public TaskTemplateController(ICosmosTemplateService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAllProjectTemplates(string projectId)
        {
            var templates = await _service.GetAllProjectTemplates(projectId);
            if (templates == null)
                return BadRequest();
            return Ok(templates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplate(string id)
        {
            var template = await  _service.GetTemplateById(id);
            if (template == null)
                return NotFound();
            return Ok(template);
        }

        [HttpPost("saveTemplate")]
        public async Task<IActionResult> Createtemplate([FromBody] TaskTemplate value)
        {
            var template = await _service.CreateTemplate(value);
            if (template == null)
                return BadRequest();
            return Created(template.ToString()?? string.Empty, template);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTemplate([FromBody] TaskTemplate value)
        {
            var template = await _service.UpdateTemplate(value);
            if (template == null)
                return BadRequest();
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
