using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
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

    //public override Project Create(Project entity)
    //{
    //    var project = _db.Projects.Add(entity).Entity;

    //    _db.UserProjectRoles.Add(new UserProjectRole()
    //    {
    //        ProjectId = project.Id,
    //        UserId = project.AuthorId,
    //        RoleId = (int)BaseProjectRole.Admin
    //    });

    //    _db.SaveChanges();
    //    return project;
    //}

    public async Task EditProject(EditProjectDto projectDto)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(proj => proj.Id == projectDto.Id);

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        project.Name = projectDto.Name;
        _db.Update(project);
        _db.SaveChanges();
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
        var users = await _db.Users
            .Where(u => usersInviteDto.Emails.Contains(u.Email))
            .ToListAsync();
             
        var project = await _db.Projects
            .Where(proj => proj.Id == usersInviteDto.ProjectId)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        var userProjectRole = new List<UserProjectRole>();

        foreach (var user in users)
        {
            project.Users.Add(user);
            userProjectRole.Add(new UserProjectRole 
            { 
                ProjectId = project.Id, 
                UserId = user.Id, 
                RoleId = (int)BaseProjectRole.Dev 
            });
        }

        await _db.UserProjectRoles.AddRangeAsync(userProjectRole);
        _db.Projects.Update(project);
        await _db.SaveChangesAsync();
    }

    public async Task KickUserOfProject(UserInviteDto usersInviteDto)
    {
        var users = await _db.Users
            .Where(u => usersInviteDto.Emails.Contains(u.Email))
            .ToListAsync();

        var project = await _db.Projects
            .Where(proj => proj.Id == usersInviteDto.ProjectId)
            .Include(proj => proj.Users)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        var userProjectRoleRemoveList = new List<UserProjectRole>();
        var userProjectRole = await _db.UserProjectRoles
            .Where(x => x.ProjectId == usersInviteDto.ProjectId)
            .ToListAsync();

        foreach (var user in users)
        {
            project.Users.Remove(user);
            userProjectRoleRemoveList.Add(userProjectRole
                    .Where(x => x.UserId == user.Id)
                    .First()
                );
        }
           
        _db.UserProjectRoles.RemoveRange(userProjectRoleRemoveList);
        _db.Projects.Update(project);
        await _db.SaveChangesAsync();
    }

    public async Task ChangeUserRole(ChangeUserRoleDto roleDto)
    {
        var usersId = roleDto.UserWithRole.Select(x => x.UserId).ToList();
        var user = await _db.Users
            .Where(u => usersId.Contains(u.Id))
            .ToListAsync();

        var userProjectRole = await _db.UserProjectRoles
            .Where(x => x.ProjectId == roleDto.ProjectId && usersId.Contains(x.UserId))
            .ToListAsync();

        _db.UserProjectRoles.RemoveRange(userProjectRole);
        await _db.SaveChangesAsync();

        foreach (var item in userProjectRole)
        {
            item.RoleId = roleDto.UserWithRole.First(u => u.UserId == item.UserId).RoleId;
        }

        _db.UserProjectRoles.AddRange(userProjectRole);
        await _db.SaveChangesAsync();
    }
}
 