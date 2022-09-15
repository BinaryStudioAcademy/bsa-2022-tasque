using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.StaticResources;
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

    public List<ProjectDto> GetProjectsByOrganizationId(int organizationId)
    {
        return _mapper.Map<List<ProjectDto>>(_db.Projects.Where(p => p.OrganizationId == organizationId));
    }

    public ProjectDto GetProjectById(int id)
    {
        return _mapper.Map<ProjectDto>(_db.Projects
            .Where(p => p.Id == id)
                .Include(p => p.ProjectTaskTypes)
                .Include(p => p.ProjectTaskStates)
                .Include(p => p.ProjectTaskPriorities)
                .Include(p => p.Users)
                .FirstOrDefault());
    }

    public IEnumerable<UserDto> GetProjectParticipants(int projectId)
    {
        var proj = _db.Projects
            .Include(x => x.Users)
            .Include(x => x.UserRoles)
            .FirstOrDefault(x => x.Id == projectId)
            ?? throw new CustomNotFoundException("project");
        return _mapper.Map<IEnumerable<UserDto>>(proj.Users);
    }

    public async Task<ProjectInfoDto> AddProject(Project entity)
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
        await SetBasicPrioritiesAndTypesAndStatesToProject(project);

        var projectAfterCreate = await _db.Projects
            .Where(proj => proj.Id == project.Id)
            .Include(p => p.UserRoles)
                .ThenInclude(u => u.User)
            .Include(p => p.UserRoles)
                .ThenInclude(r => r.Role)
            .FirstOrDefaultAsync();

        return _mapper.Map<ProjectInfoDto>(projectAfterCreate);
    }

    public async Task SetBasicPrioritiesAndTypesAndStatesToProject(Project project)
    {
        var priorities = new List<TaskPriority>()
        {
            new()
            {
                Type = BasicTaskPriorityTypes.Highest,
                Name = BasicTaskPriorityTypes.Highest.ToString(),
                Color = TaskColors.Highest,
                ProjectId = project.Id,
            },
            new()
            {
                Type = BasicTaskPriorityTypes.High,
                Name = BasicTaskPriorityTypes.High.ToString(),
                Color = TaskColors.High,
                ProjectId = project.Id,
            },
            new()
            {
                Type = BasicTaskPriorityTypes.Medium,
                Name = BasicTaskPriorityTypes.Medium.ToString(),
                Color = TaskColors.Medium,
                ProjectId = project.Id,
            },
            new()
            {
                Type = BasicTaskPriorityTypes.Low,
                Name = BasicTaskPriorityTypes.Low.ToString(),
                Color = TaskColors.Low,
                ProjectId = project.Id,
            },
            new()
            {
                Type = BasicTaskPriorityTypes.Lowest,
                Name = BasicTaskPriorityTypes.Lowest.ToString(),
                Color = TaskColors.Lowest,
                ProjectId = project.Id,
            },
        };

        var types = new List<TaskType>()
        {
            new()
            {
                Color = TaskColors.Bug,
                Name = "Bug",
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.Story,
                Name = "Story",
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.Task,
                Name = "Task",
                ProjectId = project.Id,
            }
        };

        var states = new List<TaskState>()
        {
            new()
            {
                Color = TaskColors.ToDo,
                Name = BasicTaskStateTypes.ToDo.ToString().ToLower(),
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.InProgress,
                Name = BasicTaskStateTypes.InProgress.ToString().ToLower(),
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.Done,
                Name = BasicTaskStateTypes.Done.ToString().ToLower(),
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.Canceled,
                Name = BasicTaskStateTypes.Canceled.ToString().ToLower(),
                ProjectId = project.Id,
            },
        };

        await _db.TaskTypes.AddRangeAsync(types);
        await _db.TaskPriorities.AddRangeAsync(priorities);
        await _db.TaskStates.AddRangeAsync(states);
        await _db.SaveChangesAsync();
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

    public async Task<ProjectInfoDto> CurrentProjectInfo(int projectId)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == projectId)
            .Include(p => p.UserRoles)
                .ThenInclude(u => u.User)
            .Include(p => p.UserRoles)
                .ThenInclude(r => r.Role)
            .FirstOrDefaultAsync();

        if (project == null)
        {
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");
        }

        return _mapper.Map<ProjectInfoDto>(project);
    }

    public List<TaskPriorityDto> GetProjectPrioritiesById(int projectId)
    {
        return _mapper.Map<List<TaskPriorityDto>>(_db.TaskPriorities.Where(p => p.ProjectId == projectId));
    }

    public List<TaskTypeDto> GetProjectTaskTypesById(int projectId)
    {
        return _mapper.Map<List<TaskTypeDto>>(_db.TaskTypes.Where(t => t.ProjectId == projectId));
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

    public List<TaskStateDto> GetProjectStatesById(int projectId)
    {
        return _mapper.Map<List<TaskStateDto>>(_db.TaskStates.Where(s => s.ProjectId == projectId));
    }

    public async Task<List<ProjectCardDTO>> GetProjectCardsByUserId(int userId)
    {
        var user = await _db.Users
            .Include(u => u.ParticipatedTasks)
            .Include(u => u.ParticipatedProjects)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new CustomNotFoundException("user");
        var projects = user.ParticipatedProjects;
        var result = projects
            .Select(p => new ProjectCardDTO
            {
                ProjectId = p.Id,
                Title = p.Name,
                AssignedIssuesCount = user.ParticipatedTasks.Where(t => t.ProjectId == p.Id).Count(),
                AllIssuesCount = _db.Tasks.Where(t => t.ProjectId == p.Id).Count()
            })
            .ToList();
        return result;
    }
}
