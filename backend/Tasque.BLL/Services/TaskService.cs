using AutoMapper;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : EntityCrudService<Common.Entities.Task>, ITaskService
    {
        private readonly IAwsTaskService _awsTaskService;
        private readonly IMapper _mapper;
        public TaskService(IAwsTaskService awsTaskService, DataContext dataContext, IMapper mapper) : base(dataContext)
        {
            _awsTaskService = awsTaskService;
            _mapper = mapper;
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
            var tasks = _mapper.Map<List<TaskDto>>(_db.Tasks.ToList());

            if (tasks == null)
                throw new NotFoundException("task");

            var customAttributes = await _awsTaskService.GetAllTasks(tasks);

            var taskList = tasks.Join(customAttributes, t => t.Id, ca => ca.Id, (t, ca) => new TaskDto()
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

                CustomFields = new()
                {
                    CustomDateFields = ca?.CustomDateFields,
                    CustomTimeFields = ca?.CustomTimeFields,
                    CustomTextFields = ca?.CustomTextFields,
                    CustomParagraphFilds = ca?.CustomParagraphFilds,
                    CustomNumberFields = ca?.CustomNumberFields,

                    CustomCheckboxFields = ca?.CustomCheckboxFields,
                    CustomDropdownFields = ca?.CustomDropdownFields,
                    CustomDropdownDependenciesFields = ca?.CustomDropdownDependenciesFields,
                },
            }).ToList();

            return taskList;
        }

        public async Task<List<TaskDto>> GetAllProjectTask(int projectId)
        {
            var tasks = _mapper.Map<List<TaskDto>>(_db.Tasks.Where(t => t.ProjectId == projectId));
            var customAwsAttributes = await _awsTaskService.GetAllTasks(tasks);

            var taskList = tasks.Join(customAwsAttributes, t => t.Id, ca => ca.Id, (t, ca) => new TaskDto()
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

                CustomFields = new()
                {
                    CustomDateFields = ca?.CustomDateFields,
                    CustomTimeFields = ca?.CustomTimeFields,
                    CustomTextFields = ca?.CustomTextFields,
                    CustomParagraphFilds = ca?.CustomParagraphFilds,
                    CustomNumberFields = ca?.CustomNumberFields,

                    CustomCheckboxFields = ca?.CustomCheckboxFields,
                    CustomDropdownFields = ca?.CustomDropdownFields,
                    CustomDropdownDependenciesFields = ca?.CustomDropdownDependenciesFields,
                },
            }).ToList();

            return taskList;
        }

        public async Task<TaskDto> GetTasksById(int id)
        {
            var task = _mapper.Map<TaskDto>(_db.Tasks.Where(t => t.Id == id));

            if (task == null)
                throw new NotFoundException("task");

            var customAwsFields = await _awsTaskService.GetTaskById(task.Id, task.ProjectId);

            if (customAwsFields == null)
                return task;

            var customFields = new CustomTaskAttributes()
            {
                CustomDateFields = customAwsFields?.CustomDateFields,
                CustomTimeFields = customAwsFields?.CustomTimeFields,
                CustomTextFields = customAwsFields?.CustomTextFields,
                CustomParagraphFilds = customAwsFields?.CustomParagraphFilds,
                CustomNumberFields = customAwsFields?.CustomNumberFields,

                CustomCheckboxFields = customAwsFields?.CustomCheckboxFields,
                CustomDropdownFields = customAwsFields?.CustomDropdownFields,
                CustomDropdownDependenciesFields = customAwsFields?.CustomDropdownDependenciesFields,
            };

            var userIdList = new List<int>();
            customAwsFields?.CustomUserFields?.ForEach(s => userIdList.Add(int.Parse(s)));

            var userFields = new List<UserDto>();
            userIdList.ForEach(i => userFields.Add(
                _mapper.Map<UserDto>(
                    _db.Users.FirstOrDefault(u => u.Id == i))));

            customFields.CustomUserFields = userFields;

            task.CustomFields = customFields;

            return task;
        }

        public Task<TaskDto> UpdateTask(TaskDto task)
        {
            throw new NotImplementedException();
        }

        private static double TryParseToDouble(string num)
        {
            try
            {
                return double.Parse(num);
            }
            catch(Exception ex)
            {
                throw new AwsException("Invalid field data: " + ex.Message);
            }
        }
    }
}
