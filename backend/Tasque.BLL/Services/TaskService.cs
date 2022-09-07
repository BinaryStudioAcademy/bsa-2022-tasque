using AutoMapper;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.Task.PartialModels;
using Tasque.Core.Common.DTO.Task.TemplateModels.IncomeModels;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : ITaskService
    {
        private readonly DataContext _dbContext;

        private readonly ICosmosTaskService _cosmosTaskService;

        private readonly ICosmosTemplateService _cosmosTemplateService;

        private readonly IMapper _mapper;

        public TaskService(
            DataContext dbContext, 
            ICosmosTaskService cosmosTaskService,
            ICosmosTemplateService cosmosTemplateService,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _cosmosTaskService = cosmosTaskService;
            _mapper = mapper;
            _cosmosTemplateService = cosmosTemplateService;
        }

        public async Task<TaskDto> CreateTask(TaskDto model)
        {
            var entity = _mapper.Map<Common.Entities.Task>(model);
            _dbContext.Add(entity);
            _dbContext.SaveChanges();

            var actualAttributes = RenameFieldsWithActualValue(
                await GetTaskTemplate(entity.ProjectId, entity.TypeId), model.CustomFields);

            var cosmosModel= new CosmosTaskModel()
            {
                Id = entity.Id.ToString(),
                CustomFields = _mapper.Map<List<CosmosTaskFields>>(actualAttributes)
            };

            var attributes = await _cosmosTaskService.CreateTask(cosmosModel);
            var task = _mapper.Map<TaskDto>(entity);

            return JoinTaskAttributesWithDto(task, 
                RenameFieldsWithActualValue(
                    await GetTaskTemplate(task.ProjectId, task.TypeId), await MapCosmosTaskFieldsToTaskCustomFields(task, attributes.CustomFields)));
        }

        public async Task DeleteTask(int id)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
                throw new CustomNotFoundException(nameof(Common.Entities.Task));

            _dbContext.Tasks.Remove(task);

            await _cosmosTaskService.DeleteTask(task.Id.ToString());

            _dbContext.SaveChanges();
        }

        public async Task<List<TaskDto>> GetAllTasks()
        {
            var tasks = _mapper.Map<List<TaskDto>>(_dbContext.Tasks);
            var customFields = await _cosmosTaskService.GetAllTasks();

            return tasks.Join(customFields, t => t.Id, ca => int.Parse(ca.Id), (t, ca) => 
                JoinTaskAttributesWithDto(t, 
                    RenameFieldsWithActualValue(
                        GetTaskTemplate(t.ProjectId, t.TypeId).Result, 
                            MapCosmosTaskFieldsToTaskCustomFields(t, ca.CustomFields).Result))).ToList();
        }

        public async Task<TaskDto> GetTaskById(int id)
        {
            var task = _mapper.Map<TaskDto>(_dbContext.Tasks.FirstOrDefault(t => t.Id == id));
            if (task == null)
                throw new CustomNotFoundException(nameof(Common.Entities.Task));

            var attributes = await _cosmosTaskService.GetTaskById(task.Id.ToString());

            return JoinTaskAttributesWithDto(task, 
                RenameFieldsWithActualValue(
                    await GetTaskTemplate(task.ProjectId, task.TypeId), 
                        await MapCosmosTaskFieldsToTaskCustomFields(task, attributes.CustomFields)));
        }

        public async Task<TaskDto> UpdateTask(TaskDto model)
        {
            var task = _dbContext.Tasks.Update(_mapper.Map<Common.Entities.Task>(model)).Entity;

            if (task == null)
                throw new CustomNotFoundException(nameof(Common.Entities.Task));

            var actualAttributes = RenameFieldsWithActualValue(
                await GetTaskTemplate(task.ProjectId, task.TypeId), model.CustomFields);

            var cosmosModel = new CosmosTaskModel()
            {
                Id = task.Id.ToString(),
                CustomFields = _mapper.Map<List<CosmosTaskFields>>(actualAttributes),
            };

            var attributes = await _cosmosTaskService.UpdateTask(cosmosModel);

            SaveChanges(task);

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(task), 
                RenameFieldsWithActualValue(
                    await GetTaskTemplate(task.ProjectId, task.TypeId), 
                        await MapCosmosTaskFieldsToTaskCustomFields(_mapper.Map<TaskDto>(task), attributes.CustomFields)));
        }

        private TaskDto JoinTaskAttributesWithDto(TaskDto task, List<TaskCustomFields> attributes)
        {
            if (attributes == null)
                return task;

            task.CustomFields = attributes;
            return task;
        }

        private async Task<TaskTemplate?> GetTaskTemplate(int projectId, int typeId)
        {
            var templates = await _cosmosTemplateService.GetAllProjectTemplates(projectId);
            return templates?.FirstOrDefault(t => t.TypeId == typeId);
        }

        private List<TaskCustomFields> RenameFieldsWithActualValue(TaskTemplate template, List<TaskCustomFields> fields)
        {
            if (template == null)
                return fields; 

            fields.ForEach(f => f.FieldName = template.CustomFields?.Find(t => t.FieldId == f.FieldId)?.Name);
            return fields;
        }

        public async Task<List<TaskCustomFields>> MapCosmosTaskFieldsToTaskCustomFields(TaskDto task, List<CosmosTaskFields> fields)
        {
            var template = await GetTaskTemplate(task.ProjectId, task.TypeId);
            var result = new List<TaskCustomFields>();

            fields.ForEach(f => result.Add(new()
            {
                FieldId = f.FieldId,
                FieldName = template.CustomFields.Find(t => t.FieldId == f?.FieldId)?.Name,
                FieldType = template.CustomFields.Find(t => t.FieldId == f?.FieldId).Type,
                FieldValue = f.FieldValue,
            }));

            return result;
        }

        public async Task CommentTask(CommentTaskDTO dto)
        {
            var task = _dbContext.Tasks.Single(t => t.Id == dto.TaskId);
            task.Comments.Add(dto.Comment);

            _dbContext.Update(task);
            await _dbContext.SaveChangesAsync();

            // TODO send notification
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

