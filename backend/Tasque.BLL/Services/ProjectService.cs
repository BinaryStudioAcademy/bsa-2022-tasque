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
using Tasque.Core.Common.Models.Events;
using Tasque.Core.Common.StaticResources;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;
using Tasque.Messaging.Abstractions;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<NewProjectDto, ProjectInfoDto, EditProjectDto, int, Project>
{
    private readonly IEventBus _bus;

    public ProjectService(DataContext db, IMapper mapper, CurrentUserParameters currentUser, IEventBus bus)
        : base(db, mapper, currentUser)
    {
        _bus = bus;
    }

    public List<ProjectDto> GetProjectsByOrganizationId(int organizationId)
    {
        return _mapper.Map<List<ProjectDto>>(_db.Projects.Where(p => p.OrganizationId == organizationId));
    }

    public async Task<ProjectDto> GetProjectById(int id)
    {
        var project = await _db.Projects
            .Where(p => p.Id == id)
                .Include(p => p.ProjectTaskTypes)
                .Include(p => p.ProjectTaskStates)
                .Include(p => p.ProjectTaskPriorities)
                .Include(p => p.Users)
                .FirstOrDefaultAsync();
        return _mapper.Map<ProjectDto>(project);
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

    public override async Task<ProjectInfoDto> Create(NewProjectDto entity)
    {
        var entityToCreate = _mapper.Map<Project>(entity);
        entityToCreate.AuthorId = _currentUserId;

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Id == entityToCreate.AuthorId);

        var organization = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == entity.OrganizationId);

        if (user == null)
            throw new HttpException(System.Net.HttpStatusCode.BadRequest, "Something went wrong, the user was not found");
        if (organization == null)
            throw new HttpException(System.Net.HttpStatusCode.BadRequest, "Organization is required for project creation");

        var project = _db.Projects.Add(entityToCreate).Entity;

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
                Name = BasicTaskPriorityTypes.Highest.ToString(),
                Color = TaskColors.Highest,
                ProjectId = project.Id,
            },
            new()
            {
                Name = BasicTaskPriorityTypes.High.ToString(),
                Color = TaskColors.High,
                ProjectId = project.Id,
            },
            new()
            {
                Name = BasicTaskPriorityTypes.Medium.ToString(),
                Color = TaskColors.Medium,
                ProjectId = project.Id,
            },
            new()
            {
                Name = BasicTaskPriorityTypes.Low.ToString(),
                Color = TaskColors.Low,
                ProjectId = project.Id,
            },
            new()
            {
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
                Name = BasicTaskStateTypes.ToDo,
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.InProgress,
                Name = BasicTaskStateTypes.InProgress,
                ProjectId = project.Id,
            },
            new()
            {
                Color = TaskColors.Done,
                Name = BasicTaskStateTypes.Done,
                ProjectId = project.Id,
                Status =  true,
            },
            new()
            {
                Color = TaskColors.Canceled,
                Name = BasicTaskStateTypes.Canceled,
                ProjectId = project.Id,
                Status =  true,
            },
        };

        await _db.TaskTypes.AddRangeAsync(types);
        await _db.TaskPriorities.AddRangeAsync(priorities);
        await _db.TaskStates.AddRangeAsync(states);
        await _db.SaveChangesAsync();
    }

    public override async Task<ProjectInfoDto> Update(int key, EditProjectDto projectDto)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == key)
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

    public async Task<IEnumerable<TaskStateDto>> UpdateProjectTaskStates(int key, IEnumerable<TaskStateDto> taskStateDtos)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == key)
            .Include(proj => proj.ProjectTaskStates)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        var entitiesToDelete = project.ProjectTaskStates;
        var taskStates = _mapper.Map<ICollection<TaskState>>(taskStateDtos);

        _db.TaskStates.RemoveRange(entitiesToDelete);
        _db.TaskStates.AddRange(taskStates);
        _db.SaveChanges();

        return _mapper.Map<IEnumerable<TaskStateDto>>(taskStates);
    }

    public async Task<IEnumerable<TaskTypeDto>> UpdateProjectTaskTypes(int key, IEnumerable<TaskTypeDto> taskTypeDtos)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == key)
            .Include(proj => proj.ProjectTaskTypes)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        var entitiesToDelete = project.ProjectTaskTypes;
        var taskTypes = _mapper.Map<ICollection<TaskType>>(taskTypeDtos);

        _db.TaskTypes.RemoveRange(entitiesToDelete);
        _db.TaskTypes.AddRange(taskTypes);
        _db.SaveChanges();

        return _mapper.Map<IEnumerable<TaskTypeDto>>(taskTypes);
    }

    public async Task<IEnumerable<TaskPriorityDto>> UpdateProjectTaskPriorities(int key, IEnumerable<TaskPriorityDto> taskPriorityDtos)
    {
        var project = await _db.Projects
            .Where(proj => proj.Id == key)
            .Include(proj => proj.ProjectTaskPriorities)
            .FirstOrDefaultAsync();

        if (project == null)
            throw new HttpException(System.Net.HttpStatusCode.NotFound, "The project with this id does not exist");

        var entitiesToDelete = project.ProjectTaskPriorities;
        var taskPriorities = _mapper.Map<ICollection<TaskPriority>>(taskPriorityDtos);

        _db.TaskPriorities.RemoveRange(entitiesToDelete);
        _db.TaskPriorities.AddRange(taskPriorities);
        _db.SaveChanges();

        return _mapper.Map<IEnumerable<TaskPriorityDto>>(taskPriorities);
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
            .Where(u => u.Email == usersInviteDto.Email)
            .Include(u => u.ParticipatedProjects)
            .FirstOrDefaultAsync();

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

        var organization = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == project.OrganizationId)
            ?? throw new HttpException(System.Net.HttpStatusCode.NotFound, "The organization with this id does not exist");

        if(user.ParticipatedProjects.Any(p => p.Id == project.Id))
            throw new HttpException(System.Net.HttpStatusCode.BadRequest, "User already participate this project");

        user.ParticipatedOrganization.Add(organization);
        user.ParticipatedProjects.Add(project);
        await _db.UserProjectRoles.AddAsync(userProjectRole);

        _db.Projects.Update(project);

        await _db.SaveChangesAsync();

        UserInvitedEvent @event = new UserInvitedEvent
        {
            ProjectId = project.Id,
            InviteeId = user.Id,
            ConnectiondId = user.ConnectionId
        };

        _bus.Publish(@event);
    }

    public async Task MoveTask(MoveTaskDTO dto)
    {
        // TODO review method functionality when FrontEnd for task moving is connected to BackEnd
        var previousBoardColumn = _db.BoardColumns.Single(b => b.Id == dto.PreviousColumnId);
        var currentBoardColumn = _db.BoardColumns.Single(b => b.Id == dto.NewColumnId);
        var task = _db.Tasks.Single(t => t.Id == dto.TaskId);

        previousBoardColumn.Tasks.Remove(task);
        currentBoardColumn.Tasks.Add(task);

        _db.Update(previousBoardColumn);
        _db.Update(currentBoardColumn);
        await _db.SaveChangesAsync();

        TaskMovedEvent @event = new()
        {
            PreviousColumnId = dto.PreviousColumnId,
            NewColumnId = dto.NewColumnId,
            TaskId = task.Id,
            TaskAuthorId = task.AuthorId,
            ConnectiondId = task.Author.ConnectionId
        };

        _bus.Publish(@event);
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

        var organization = await _db.Organizations.FirstOrDefaultAsync(o => o.Id == project.OrganizationId)
            ?? throw new HttpException(System.Net.HttpStatusCode.NotFound, "The organization with this id does not exist");

        if (!organization.Users.Any(u => u.Id == user.Id))
            user.ParticipatedOrganization.Remove(organization);

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
