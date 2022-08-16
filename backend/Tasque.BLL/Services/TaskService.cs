using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : EntityCrudService<Common.Entities.Task>, ITaskService
    {
        private readonly IAwsTaskService _awsTaskService;
        public TaskService(IAwsTaskService awsTaskService, DataContext dataContext) : base(dataContext)
        {
            _awsTaskService = awsTaskService;
        }

        public Task<TaskDto> CreateTask(CreateTask model)
        {
            throw new NotImplementedException();
        }

        public Task DeleteTask(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TaskDto>> GetAllTasks()
        {
            var tasks = _db.Tasks.ToList();
            var customAttributes = await _awsTaskService.GetAllTasks();

            var taskList = tasks.Join(customAttributes, t => t.Id, ca => ca.TaskId, (t, ca) => new TaskDto()
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Summary = t.Summary,

                State = t.State,
                Type = t.Type,
                Priority = t.Priority,

                Deadline = t.Deadline,
                FinishedAt = t.FinishedAt,

                AuthorId = t.AuthorId,
                ProjectId = t.ProjectId,
                BoardColumnId = t.BoardColumnId,
                SprintId = t.SprintId,
                LastUpdatedById = t.LastUpdatedById,
                ParentTaskId = t.ParentTaskId,

                CustomFields = ca,
            }).ToList();

            return taskList;
        }

        public async Task<List<TaskDto>> GetAllProjectTask(int projectId)
        {
            var tasks = _db.Tasks.Where(t => t.ProjectId == projectId);
            var customAttributes = await _awsTaskService.GetAllTasks();

            var taskList = tasks.Join(customAttributes, t => t.Id, ca => ca.TaskId, (t, ca) => new TaskDto()
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Summary = t.Summary,

                State = t.State,
                Type = t.Type,
                Priority = t.Priority,

                Deadline = t.Deadline,
                FinishedAt = t.FinishedAt,

                AuthorId = t.AuthorId,
                ProjectId = t.ProjectId,
                BoardColumnId = t.BoardColumnId,
                SprintId = t.SprintId,
                LastUpdatedById = t.LastUpdatedById,
                ParentTaskId = t.ParentTaskId,

                CustomFields = ca,
            }).ToList();

            return taskList;
        }

        public Task<TaskDto> GetTasksById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<TaskDto> UpdateTask(TaskDto task)
        {
            throw new NotImplementedException();
        }
    }
}
