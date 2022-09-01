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
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost("saveTemplate")]
        public IActionResult Post([FromBody] TaskTemplate value)
        {
            return Ok(value);
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
