using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task.TemplateModels.IncomeModels;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskTemplateController : ControllerBase
    {
        private readonly ICosmosTemplateService _service;
        public TaskTemplateController(ICosmosTemplateService service) => _service = service;

        [HttpGet("all/{projectId}")]
        public async Task<IActionResult> GetAllProjectTemplates(int projectId)
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

        [HttpPut]
        public async Task<IActionResult> UpdateTemplate([FromBody] TaskTemplate value)
        {
            var template = await _service.UpdateTemplate(value);
            if (template == null)
                return BadRequest($"Unexpected problem occurred");
            return Created(template.ToString()?? "", template);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplate(string id)
        {
            await _service.DeleteTemplate(id);
            return NoContent();
        }
    }
}
