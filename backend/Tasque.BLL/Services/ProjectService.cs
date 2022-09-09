using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    private readonly IMapper _mapper;
    public ProjectService(DataContext db, IMapper mapper) : base(db)
    {
        _mapper = mapper;
    }

    public async Task<ProjectAfterCreateDto> AddProject(Project entity)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Id == entity.AuthorId);

        if (user == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "Something went wrong, the user was not found");
        }

        var project = _db.Projects.Add(entity).Entity;

        project.UserRoles.Add(new UserProjectRole
        {
            ProjectId = project.Id,
            UserId = user.Id,
            RoleId = (int)BaseProjectRole.Admin
        });
        project.Users.Add(user);
        await _db.SaveChangesAsync();
        return _mapper.Map<ProjectAfterCreateDto>(project);
    }

    public async Task<ProjectInfoDto> EditProject(EditProjectDto projectDto)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == projectDto.Id)
            .Include(proj => proj.Users)
            .Include(proj => proj.UserRoles)
                .ThenInclude(r => r.Role)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        project.Name = projectDto.Name;
        project.Key = projectDto.Key;
        _db.Update(project);
        _db.SaveChanges();

        return _mapper.Map<ProjectInfoDto>(project);
    }

    public async Task<List<ProjectInfoDto>> GetAllProjectsOfOrganization(int organizationId)
    {
        var projects = await _db.Projects
            .Where(proj => proj.OrganizationId == organizationId)
            .Include(p => p.UserRoles)
                .ThenInclude(u => u.User)
            .Include(p => p.UserRoles)
                .ThenInclude(r => r.Role)
            .ToListAsync();

        return _mapper.Map<List<ProjectInfoDto>>(projects);
    }

    public async Task InviteUserToProject(UserInviteDto usersInviteDto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == usersInviteDto.Email);

        var project = await _db.Projects
            .FirstOrDefaultAsync(proj => proj.Id == usersInviteDto.ProjectId);

        if (user == null)
        {
            //TO DO: There should be logic for inviting the user if this does not registered now
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The user with this email does not exist");
        }

        if (project == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");
        }

        project.Users.Add(user);
        var userProjectRole = new UserProjectRole()
        {
            ProjectId = project.Id,
            UserId = user.Id,
            RoleId = (int)BaseProjectRole.Dev
        };

        await _db.UserProjectRoles.AddAsync(userProjectRole);
        _db.Projects.Update(project);

        await _db.SaveChangesAsync();
    }

    public async Task KickUserOfProject(UserInviteDto usersInviteDto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == usersInviteDto.Email);

        var project = await _db.Projects
            .Where(proj => proj.Id == usersInviteDto.ProjectId)
            .Include(proj => proj.Users)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "A user with such an email is not a member of the project");
        }

        if (project == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");
        }

        var userProjectRole = await _db.UserProjectRoles
            .Where(x => x.ProjectId == usersInviteDto.ProjectId
            && x.UserId == user.Id)
            .FirstOrDefaultAsync();

        if (userProjectRole == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "Make sure that the user is a member of the project");
        }

        project.Users.Remove(user);
        _db.UserProjectRoles.RemoveRange(userProjectRole);

        _db.Projects.Update(project);
        await _db.SaveChangesAsync();
    }

    public async Task ChangeUserRole(ChangeUserRoleDto roleDto)
    {
        var userProjecRole = await _db.UserProjectRoles
            .FirstOrDefaultAsync(u => u.UserId == roleDto.UserId && u.ProjectId == roleDto.ProjectId);

        if (userProjecRole == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "Make sure that the user is a member of the project");
        }

        _db.UserProjectRoles.Remove(userProjecRole);
        await _db.SaveChangesAsync();

        userProjecRole.RoleId = roleDto.RoleId;

        _db.UserProjectRoles.Add(userProjecRole);
        await _db.SaveChangesAsync();
    }

    public async Task<BoardInfoDto> GetProjectBoard(int projectId)
    {
        var project = await _db.Projects
            .Include(x => x.Columns).ThenInclude(x => x.Tasks)
            .Include(x => x.Users)
            .FirstOrDefaultAsync(x => x.Id == projectId)
            ?? throw new CustomNotFoundException("project");

        return _mapper.Map<BoardInfoDto>(project);
    }

    public async Task<BoardInfoDto> UpdateTasks(BoardInfoDto board)
    {
        var mapped = _mapper.Map<Project>(board).Columns.SelectMany(x => x.Tasks);
        var tasks = _db.Projects
            .Include(x => x.Columns).ThenInclude(x => x.Tasks)
            .FirstOrDefault(x => x.Id == board.Id)?
            .Columns.SelectMany(x => x.Tasks)
            ?? throw new CustomNotFoundException("project board");

        foreach (var task in mapped)
        {
            var entity = tasks.FirstOrDefault(x => x.Id == task.Id);
            if (entity == null) continue;

            entity.BoardColumnId = task.BoardColumnId;
        }
        await _db.SaveChangesAsync();
        return await GetProjectBoard(board.Id);
    }

    public async Task<BoardInfoDto> UpdateColumns(BoardInfoDto board)
    {
        var mapped = _mapper.Map<Project>(board).Columns;
        var columns = _db.Projects
            .Include(x => x.Columns)
            .FirstOrDefault(x => x.Id == board.Id)?
            .Columns
            ?? throw new CustomNotFoundException("project board");

        foreach (var column in mapped)
        {
            if (column.Id == 0)
            {
                _db.BoardColumns.Add(column);
                continue;
            }
        }

        await _db.SaveChangesAsync();
        return await GetProjectBoard(board.Id);
    }
}
