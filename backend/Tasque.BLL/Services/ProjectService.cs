using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Common.Entities.Project>
{
    private readonly IMapper _mapper;

    public ProjectService(DataContext db, IMapper mapper) : base(db)
    {
        _mapper = mapper;
    }

    public async Task EditProject(EditProjectDto projectDto)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(proj => proj.Id == projectDto.Id);

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        project.Name = projectDto.Name;
        _db.Update(project);
        _db.SaveChanges();
    }

    public async Task<List<ProjectInfoDto>> GetAllUserProject(int userId)
    {
        var projects = await _db.Projects
            .Where(proj => proj.AuthorId == userId)
            .Include(p => p.Users)
                .ThenInclude(p => p.Roles)
            .ToListAsync();

        return _mapper.Map<List<ProjectInfoDto>>(projects);
    }

    public async Task InviteUserToProject(UserInviteDto usersInviteDto)
    {
        var users = await _db.Users
            .Where(u => usersInviteDto.Emails.Contains(u.Email))
            .ToListAsync();

        //if(user == null)
            //some logic If user not exist           
             
        var project = await _db.Projects
                .Where(proj => proj.Id == usersInviteDto.ProjectId)
                .FirstOrDefaultAsync();

        //if(project == null)
        //error

        foreach (var user in users)
            project.Users.Add(user);

        _db.Projects.Update(project);
        await _db.SaveChangesAsync();
    }
}
 