using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project/")]
public class ProjectController : EntityController
    <NewProjectDto, ProjectInfoDto, EditProjectDto, int, ProjectService>
{
    public ProjectController(ProjectService service)
        : base(service)
    {

    }

    [HttpGet("all/{organizationId}")]
    public async Task<IActionResult> GetAllProjectsOfOrganization(int organizationId)
    {
        return Ok(await _service.GetAllProjectsOfOrganization(organizationId));
    }

    [HttpPut("invite")]
    public async Task<IActionResult> InviteUserToProject([FromBody] UserInviteDto userInviteDto)
    {
        var isUserHasBeenAdded = await _service.InviteUserToProject(userInviteDto);

        return Ok(isUserHasBeenAdded);
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

    [HttpGet("board/{projectId:int}")]
    public async Task<IActionResult> GetBoard(int projectId)
    {
        var res = await _service.GetProjectBoard(projectId);
        return Ok(res);
    }

    [HttpPut("board/tasks")]
    public async Task<IActionResult> UpdateBoardTasks(BoardInfoDto board)
    {
        var res = await _service.UpdateTasks(board);
        return Ok(res);
    }

    [HttpPut("board/columns")]
    public async Task<IActionResult> UpdateBoardColumns(BoardInfoDto board)
    {
        var res = await _service.UpdateColumns(board);
        return Ok(res);
    }

    [Route("current/{id}")]
    [HttpGet]
    public async Task<IActionResult> CurrentProjectInfo(int id)
    {
        var result = await _service.CurrentProjectInfo(id);

        return Ok(result);
    }

    [HttpGet("getByOrganizationId/{organizationId}")]
    public IActionResult GetProjectsByOrganizationId(int organizationId)
    {
        var projects = _service.GetProjectsByOrganizationId(organizationId);
        if (projects == null)
            return NotFound();
        return Ok(projects);
    }

    [HttpGet("getParticipants/{projectId}")]
    public IActionResult GetProjectParticipants(int projectId)
    {
        var participants = _service.GetProjectParticipants(projectId);
        if (participants == null)
            return NotFound();
        return Ok(participants);
    }

    [HttpGet("getProjectPriorities/{projectId}")]
    public IActionResult GetProjectPriorities(int projectId)
    {
        var priorities = _service.GetProjectPrioritiesById(projectId);
        if (priorities == null)
            return NotFound("Project or it's task priorities not found");
        return Ok(priorities);
    }
}
