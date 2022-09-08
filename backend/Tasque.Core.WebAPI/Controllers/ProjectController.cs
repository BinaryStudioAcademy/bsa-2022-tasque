﻿using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> EditProject([FromBody]EditProjectDto editProjectDto)
    {
        var result = await _service.EditProject(editProjectDto);

        return Ok(result);
    }

    [HttpGet("all/{organizationId}")]
    public async Task<IActionResult> GetAllProjectsOfOrganization(int organizationId)
    {
        return Ok(await _service.GetAllProjectsOfOrganization(organizationId));
    }

    [HttpPut("invite")]
    public async Task<IActionResult> InviteUserToProject([FromBody]UserInviteDto userInviteDto)
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

    [HttpPut("board")]
    public async Task<IActionResult> UpdateBoard(BoardInfoDto board)
    {
        var res = await _service.UpdateBoard(board);
        return Ok(res);
    }
}
