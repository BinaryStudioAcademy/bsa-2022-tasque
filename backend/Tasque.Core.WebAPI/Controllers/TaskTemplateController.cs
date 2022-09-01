using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.DTO.Task.TemplateModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskTemplateController : ControllerBase
    {
        public TaskTemplateController()
        {

        }

        [HttpGet]
        public IEnumerable<TaskTemplate> GetAllProjectTemplates(int projectId)
        {
            return null;
        }

        [HttpGet("{id}")]
        public IActionResult GetTemplate(int id)
        {
            return Ok();
        }

        [HttpPost("saveTemplate")]
        public IActionResult Createtemplate([FromBody] TaskTemplate value)
        {
            return Ok(value);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTemplate([FromBody] TaskTemplate value)
        {
            return Ok(value);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTemplate(int id)
        {
            return NoContent();
        }
    }
}
