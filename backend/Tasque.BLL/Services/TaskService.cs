using AutoMapper;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels.TaskEntity;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : ITaskService
    {
        private readonly DataContext _dbContext;

        private readonly ICosmosTaskService _cosmosTaskService;

        private readonly IMapper _mapper;

        public TaskService(
            DataContext dbContext, 
            ICosmosTaskService cosmosTaskService, 
            IMapper mapper)
        {
            _dbContext = dbContext;
            _cosmosTaskService = cosmosTaskService;
            _mapper = mapper;
        }

        public async Task<TaskDto> CreateTask(TaskDto model)
        {
            var entity = _mapper.Map<Common.Entities.Task>(model);
            _dbContext.Add(entity);
            _dbContext.SaveChanges();

            var cosmosModel= new TaskCosmosModel()
            {
                Id = entity.Id.ToString(),
                CustomFields = model.CustomFields
            };

            var attributes = await _cosmosTaskService.CreateTask(cosmosModel);

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(entity), attributes);
        }

        public async Task DeleteTask(int id)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
                throw new NotFoundException(nameof(Common.Entities.Task));

            _dbContext.Tasks.Remove(task);

            await _cosmosTaskService.DeleteTask(task.Id.ToString());

            _dbContext.SaveChanges();
        }

        public async Task<List<TaskDto>> GetAllTasks()
        {
            var tasks = _mapper.Map<List<TaskDto>>(_dbContext.Tasks);
            var customFields = await _cosmosTaskService.GetAllTasks();

            return tasks.Join(customFields, t => t.Id, ca => int.Parse(ca.Id), (t, ca) => JoinTaskAttributesWithDto(t, ca)).ToList();
        }

        public async Task<TaskDto> GetTaskById(int id)
        {
            var task = _mapper.Map<TaskDto>(_dbContext.Tasks.FirstOrDefault(t => t.Id == id));
            if (task == null)
                throw new NotFoundException(nameof(Common.Entities.Task));

            var attributes = await _cosmosTaskService.GetTaskById(task.Id.ToString());

            return JoinTaskAttributesWithDto(task, attributes);
        }

        public async Task<TaskDto> UpdateTask(TaskDto model)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == model.Id);

            if (task == null)
                throw new NotFoundException(nameof(Common.Entities.Task));

            var cosmosModel = new TaskCosmosModel()
            {
                Id = task.Id.ToString(),
                CustomFields = model?.CustomFields,
            };

            var customAttributes = await _cosmosTaskService.UpdateTask(cosmosModel);

            task.Description = model.Description;
            task.Summary = model.Summary;
            task.Labels = model.Labels;
            task.SprintId = model.SprintId;
            task.Attachments = model.Attachments;
            task.BoardColumnId = model.BoardColumnId;
            task.Description = model.Description;
            task.Deadline = model.Deadline;
            task.LastUpdatedById = model.LastUpdatedById;

            SaveChanges(task);

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(task), customAttributes);
        }

        private TaskDto JoinTaskAttributesWithDto(TaskDto task, TaskCosmosModel? attributes)
        {
            if (attributes == null)
                return task;

            task.CustomFields = attributes?.CustomFields;
            return task;
        }

        private void SaveChanges<T>(T entity)
            where T : BaseEntity
        {
            try
            {
                _dbContext.SaveChanges();
            }
            catch (Exception)
            {
                _dbContext.Entry(entity);
            }
        }
    }
}

