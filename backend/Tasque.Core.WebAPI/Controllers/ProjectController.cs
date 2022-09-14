using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project/")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service, CurrentUserParameters currentUser)
        : base(service, currentUser)
    {

    }

    [HttpPut("edit")]
    public async Task<IActionResult> EditProject([FromBody] EditProjectDto editProjectDto)
    {
        var result = await _service.EditProject(editProjectDto);

        return Ok(result);
    }

    [HttpGet("all/{organizationId}")]
    public async Task<IActionResult> GetAllProjectsOfOrganization(int organizationId)
    {
        return Ok(await _service.GetAllProjectsOfOrganization(organizationId));
    }

    [HttpGet("getById/{id}")]
    public override IActionResult GetById(int id)
    {
        var project = _service.GetProjectById(id);
        if(project == null)
            return NotFound("Project Not Found");
        return Ok(project);
        
    }

    [HttpPut("invite")]
    public async Task<IActionResult> InviteUserToProject([FromBody] UserInviteDto userInviteDto)
    {
        await _service.InviteUserToProject(userInviteDto);

        return Ok();
    }

    [HttpPost("move")]
    public async Task<IActionResult> MoveTaskToAnotherColumn([FromBody] MoveTaskDTO dto)
    {
        await _service.MoveTask(dto);
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

    [Route("add")]
    [HttpPost]
    public async Task<IActionResult> AddProject([FromBody] NewProjectDto entityDTO)
    {
        var entity = new Project()
        {
            Name = entityDTO.Name,
            Key = entityDTO.Key,
            OrganizationId = entityDTO.OrganizationId,
            AuthorId = _currentUser.Id
        };

        var result = await _service.AddProject(entity);
        return Ok(result);
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

    [HttpGet("{projectId}/participants")]
    public IActionResult GetProjectParticipants(int projectId)
    {
        var participants = _service.GetProjectParticipants(projectId);
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

    [HttpGet("getProjectStates/{projectId}")]
    public IActionResult GetProjectStates(int projectId)
    {
        var states = _service.GetProjectStatesById(projectId);
        if (states == null)
            return NotFound("Project or it's task states not found");
        return Ok(states);
    }

    [HttpPost("invite")]
    public async Task<IActionResult> InviteUser([FromBody] InviteUserDTO dto)
    {
        var invited = await _service.InviteUser(dto);
        if (invited)
        {
            return Ok();
        }
        return BadRequest("User was not found or has not confirmed its account yet");
    }
}


