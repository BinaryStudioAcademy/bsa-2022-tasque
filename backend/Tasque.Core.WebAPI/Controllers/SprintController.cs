using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Task;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/sprint")]
    public class SprintController : EntityController<Sprint, SprintDto, SprintService>
    {
        public SprintController(SprintService service, CurrentUserParameters currentUser)
           : base(service, currentUser)
        {

        }

        [Route("complete/{id}")]
        [HttpPut]
        public async Task<IActionResult> CompleteSprint(int id)
        {
            await _service.CompleteSprint(id);

            return Ok();
        }

        [Route("edit")]
        [HttpPut]
        public virtual async Task<IActionResult> Edit([FromBody] EditSprintDto sprintDto)
        {
            var entity = await _service.Edit(sprintDto);
            var dto = mapper.Map<SprintDto>(entity);
            return Ok(dto);
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
            var dto = mapper.Map<SprintDto>(sprints);
            return Ok(dto);
        }
    }
}
