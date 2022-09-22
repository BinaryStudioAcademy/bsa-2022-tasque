using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectParticipantsController : EntityController
    <NewProjectDto, ProjectInfoDto, EditProjectDto, int, ProjectService>
    {
        private readonly int _userId;
        public ProjectParticipantsController(ProjectService service, CurrentUserParameters userParams)
            : base(service)
        {
            _userId = userParams.Id;
        }

        [HttpGet("{projectId}/participants")]
        public IActionResult GetProjectParticipants(int projectId)
        {
            var participants = _service.GetProjectParticipants(projectId);
            return Ok(participants);
        }

        [HttpPut("invite")]
        public async Task<IActionResult> InviteUserToProject([FromBody] UserInviteDto userInviteDto)
        {
            await _service.InviteUserToProject(userInviteDto);
            return Ok();
        }

        [HttpPut("kick")]
        public async Task<IActionResult> KickUser([FromBody] UserInviteDto userInviteDto)
        {
            await _service.KickUserOfProject(userInviteDto);

            return Ok();
        }

        [HttpPut("role")]
        public async Task<IActionResult> UpdateUserRole([FromBody] ChangeUserRoleDto changeUserRoleDto)
        {
            await _service.ChangeUserRole(changeUserRoleDto);

            return Ok();
        }

        [HttpGet("getProjectCards")]
        public async Task<IActionResult> GetProjectCards()
        {
            var result = await _service.GetProjectCardsByUserId(_userId);

            return Ok(result);
        }
    }
}
