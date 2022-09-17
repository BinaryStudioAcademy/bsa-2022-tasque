using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Extensions;
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
            var project = _dbContext.Projects.FirstOrDefault(p => p.Id == model.ProjectId) ?? throw new CustomNotFoundException("project");

            entity.Key = project.Key + '-' + UpdateProjectCounter(project.Id);

            _dbContext.Add(entity);
            _dbContext.SaveChanges();

            var actualAttributes = RenameFieldsWithActualValue(
                await GetTaskTemplate(entity.ProjectId, entity.TypeId), model.CustomFields);

            var cosmosModel = new CosmosTaskModel()
            {
                Id = entity.Id.ToString(),
                CustomFields = _mapper.Map<List<CosmosTaskFields>>(actualAttributes)
            };

            var attributes = await _cosmosTaskService.CreateTask(cosmosModel);
            var task = await GetTaskById(entity.Id);

            return JoinTaskAttributesWithDto(task,
                RenameFieldsWithActualValue(
                    await GetTaskTemplate(task.ProjectId, task.TypeId), await MapCosmosTaskFieldsToTaskCustomFields(task, attributes.CustomFields)));
        }

        public async Task DeleteTask(int id)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == id)
                ?? throw new CustomNotFoundException(nameof(Common.Entities.Task));

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

        public async Task<List<TaskDto>> GetAllProjectTasks(int projectId)
        {
            var tasks = _mapper.Map<List<TaskDto>>(_dbContext.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Users)
                .Include(t => t.Author)
                .Include(t => t.Sprint)
                .Include(t => t.LastUpdatedBy)
                .Include(t => t.Priority)
                .Include(t => t.State)
                .Include(t => t.Project)
                .Include(t => t.Type));

            var customFields = await _cosmosTaskService.GetAllProjectTasks(projectId);

            if (!customFields.Any())
                return tasks;

            return tasks.Join(customFields, t => t.Id, ca => int.Parse(ca.Id), (t, ca) =>
                JoinTaskAttributesWithDto(t,
                    RenameFieldsWithActualValue(
                        GetTaskTemplate(t.ProjectId, t.TypeId).Result,
                            MapCosmosTaskFieldsToTaskCustomFields(t, ca.CustomFields).Result))).ToList();
        }

        public async Task<TaskDto> GetTaskById(int id)
        {
            var task = _mapper.Map<TaskDto>(_dbContext.Tasks
                .Include(t => t.Users)
                .Include(t => t.Author)
                .Include(t => t.Sprint)
                .Include(t => t.LastUpdatedBy)
                .Include(t => t.Priority)
                .Include(t => t.State)
                .Include(t => t.Project)
                .Include(t => t.Type)
                .FirstOrDefault(t => t.Id == id));

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
            var currentProjectId = _dbContext.Projects.FirstOrDefault(p => p.Id == _dbContext.Tasks.FirstOrDefault(t => t.Id == model.Id).ProjectId).Id;

            if (model.ProjectId != currentProjectId)
            {
                var project = await _dbContext.Projects.FirstOrDefaultAsync(p => p.Id == model.ProjectId) ?? throw new CustomNotFoundException("project");
                model.Key = project.Key + '-' + UpdateProjectCounter(project.Id);
            }

            var entityTask = await _dbContext.Tasks
                .Include(task => task.Users)
                .FirstOrDefaultAsync(t => t.Id == model.Id)
                ?? throw new CustomNotFoundException("task");

            var task = _mapper.Map<Common.Entities.Task>(model);
            entityTask.Users.Clear();

            foreach (var user in task.Users)
            {
                var userEntity = _dbContext.Users
                    .FirstOrDefault(u => u.Id == user.Id)
                    ?? throw new ValidationException("Coudn't find user to assign with given id");

                entityTask.Users.Add(userEntity);
            }

            _dbContext.Entry(entityTask).CurrentValues.SetValues(task);

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

            var response = await _dbContext.Tasks
                .Include(t => t.Users)
                .Include(t => t.Author)
                .Include(t => t.Sprint)
                .Include(t => t.LastUpdatedBy)
                .Include(t => t.Priority)
                .Include(t => t.State)
                .Include(t => t.Project)
                .Include(t => t.Type)
                .FirstOrDefaultAsync(t => t.Id == model.Id)
                ?? throw new CustomNotFoundException("task"); ;

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(response),
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
            if (template == null || fields == null)
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

        private int UpdateProjectCounter(int projectId)
        {
            var project = _dbContext.Projects.FirstOrDefault(p => p.Id == projectId) ?? throw new CustomNotFoundException("project");
            project.ProjectTaskCounter += 1;
            _dbContext.SaveChanges();
            return project.ProjectTaskCounter;
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

        public async Task<IEnumerable<TaskDto>> SetOrder(IEnumerable<int> ids)
        {
            var tasks = _dbContext.Tasks.Where(x => ids.Contains(x.Id));
            tasks.SetOrder(ids);
            await _dbContext.SaveChangesAsync();

            tasks = tasks.OrderBy(x => x.Order);
            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }
    }
}

