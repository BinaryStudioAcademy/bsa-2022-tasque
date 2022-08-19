using AutoMapper;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.Entities.Abstract;
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

        public async Task<TaskDto> CreateTask(CreateTask model)
        {
            var entity = _mapper.Map<Common.Entities.Task>(model);
            await _awsTaskService.CreateTask(_mapper.Map<CustomAwsTaskAttributes>(model.CustomFields));

            _db.Add(entity);
            _db.SaveChanges();

            return _mapper.Map<TaskDto>(entity);
        }

        public async Task DeleteTask(int id)
        {
            var task = _db.Tasks.FirstOrDefault(t => t.Id == id);
            _db.Tasks.Remove(task);
            await _awsTaskService.DeleteTask(task.Id, task.ProjectId);
            _db.SaveChanges();
        }

        public async Task<List<TaskDto>> GetAllTasks()
        {
            var tasks = _mapper.Map<List<TaskDto>>(_db.Tasks.ToList());

            if (tasks == null)
                throw new NotFoundException("task");

            var customAttributes = await _awsTaskService.GetAllTasks();

            var taskList = tasks.Join(customAttributes, t => t.Id, ca => ca.Id, (t, ca) => new TaskDto(t, ca)).ToList();

            return taskList;
        }

        public async Task<List<TaskDto>> GetAllProjectTask(int projectId)
        {
            var tasks = _mapper.Map<List<TaskDto>>(_db.Tasks.Where(t => t.ProjectId == projectId));
            var customAwsAttributes = await _awsTaskService.GetAllTasks();

            var taskList = tasks.Join(customAwsAttributes, t => t.Id, ca => ca.Id, (t, ca) => new TaskDto(t, ca)).ToList();

            return taskList;
        }

        public async Task<TaskDto> GetTasksById(int id)
        {
            var task = _mapper.Map<TaskDto>(_db.Tasks.FirstOrDefault(t => t.Id == id));

            if (task == null)
                throw new NotFoundException("task");

            var customAwsFields = await _awsTaskService.GetTaskById(task.Id, task.ProjectId);

            if (customAwsFields == null)
                return task;

            var customFields = new CustomTaskAttributes()
            {
                CustomDateFields = customAwsFields?.CustomDateFields,
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

        public async Task<TaskDto> UpdateTask(UpdateTask model)
        {
            var task = _db.Tasks.FirstOrDefault(t => t.Id == model.Id);

            if (task == null)
                throw new NotFoundException("task");

            var customAttributes = await _awsTaskService.UpdateTask(model?.CustomFields?? new());

            task.Labels = model.Labels;
            task.SprintId = model.SprintId;
            task.Attachments = model.Attachments;
            task.BoardColumnId = model.BoardColumnId;
            task.Description = model.Description;
            task.Deadline = model.Deadline;
            task.LastUpdatedById = model.LastUpdatedById;

            SaveChanges(task);

            return _mapper.Map<TaskDto>(task);
        }

        private void SaveChanges<T>(T entity) 
            where T : BaseEntity
        {
            try
            {
                _db.SaveChanges();
            }
            catch (Exception)
            {
                _db.Entry(entity);
            }
        }
    }
}
