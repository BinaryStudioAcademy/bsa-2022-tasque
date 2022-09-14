using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Models.Task;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/sprint")]
    public class SprintController : EntityController<NewSprintDto, SprintDto, EditSprintDto, int, SprintService>
    {
        public SprintController(SprintService service)
           : base(service)
        {

        }

        [HttpPost("createSprint")]
        public async Task<IActionResult> Create([FromBody] NewSprintDto sprintDto)
        {
            return Ok(await _service.Create(sprintDto));
        }

        [Route("complete/{id}")]
        [HttpPut]
        public async Task<IActionResult> CompleteSprint(int id)
        {
            await _service.CompleteSprint(id);

            return Ok();
        }

        [Route("getSprintsByProjectId/{id}")]
        [HttpGet]
        public async virtual Task<IActionResult> GetSprintsByProjectId(int id)
        {
            var sprints = await _service.GetProjectSprints(id);

            if (sprints is not null)
            {
                return Ok(sprints);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

        [Route("getArchiveSprintsByProjectId/{id}")]
        [HttpGet]
        public async virtual Task<IActionResult> GetArchiveSprintsByProjectId(int id)
        {
            var sprints = await _service.GetProjectArchiveSprints(id);

            if (sprints is not null)
            {
                return Ok(sprints);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

        [Route("{id}/tasks")]
        [HttpGet]
        public async virtual Task<IActionResult> GetSprintTasks(int id)
        {
            var tasks = await _service.GetSprintTasks(id);

            if (tasks is not null)
            {
                return Ok(tasks);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

        [Route("{id}/users")]
        [HttpGet]
        public async virtual Task<IActionResult> GetSprintUsers(int id)
        {
            var tasks = await _service.GetSprintUsers(id);

            if (tasks is not null)
            {
                return Ok(tasks);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

        [Route("estimate")]
        [HttpPut]
        public async virtual Task<IActionResult> UpdateTaskEstimate([FromBody] TaskEstimateUpdate taskEstimateUpdate)
        {
            await _service.UpdateTaskEstimate(taskEstimateUpdate);

            return Ok();
        }

        [HttpPut("order")]
        public async Task<IActionResult> Order([FromBody] IEnumerable<int> ids)
        {
            var sprints = await _service.OrderSprints(ids);
            
            return Ok(sprints);
        }

        [Route("deleteSprint/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteSprint(int id)
        {
            await _service.Delete(id, _currentUser.Id);

            return NoContent();
        }
    }
}
