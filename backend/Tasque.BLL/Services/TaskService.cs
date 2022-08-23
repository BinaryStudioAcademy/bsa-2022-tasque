using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
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

        public async Task<TaskDto> CreateTask(CreateTaskModel model)
        {
            var entity = _mapper.Map<Common.Entities.Task>(model);
            _dbContext.Add(entity);
            _dbContext.SaveChanges();

            var cosmosModel= new TaskCosmosModel()
            {
                Id = entity.Id.ToString(),
                CustomFields = model.CustomFields,
            };

            var attributes = await _cosmosTaskService.CreateTask(cosmosModel);

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(entity), attributes.CustomFields);
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

            return tasks.Join(customFields, t => t.Id, ca => int.Parse(ca.Id), (t, ca) => JoinTaskAttributesWithDto(t, ca.CustomFields)).ToList();
        }

        public async Task<TaskDto> GetTaskById(int id)
        {
            var task = _mapper.Map<TaskDto>(_dbContext.Tasks.FirstOrDefault(t => t.Id == id));
            if (task == null)
                throw new NotFoundException(nameof(Common.Entities.Task));

            var attributes = await _cosmosTaskService.GetTaskById(task.Id.ToString());

            return JoinTaskAttributesWithDto(task, attributes.CustomFields);
        }

        public async Task<TaskDto> UpdateTask(TaskDto model)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == model.Id);

            if (task == null)
                throw new NotFoundException(nameof(Common.Entities.Task));

            var customAttributes = await _cosmosTaskService.UpdateTask(_mapper.Map<TaskCosmosModel>(model.CustomFields));

            task.Labels = model.Labels;
            task.SprintId = model.SprintId;
            task.Attachments = model.Attachments;
            task.BoardColumnId = model.BoardColumnId;
            task.Description = model.Description;
            task.Deadline = model.Deadline;
            task.LastUpdatedById = model.LastUpdatedById;

            SaveChanges(task);

            return JoinTaskAttributesWithDto(_mapper.Map<TaskDto>(task), customAttributes.CustomFields);
        }

        private TaskDto JoinTaskAttributesWithDto(TaskDto task, CosmosTaskFields? attributes)
        {
            if (attributes == null)
                return task;

            var customFields = new TaskCustomFields()
            {
                CustomDateFields = attributes.CustomDateFields,
                CustomTextFields = attributes.CustomTextFields,
                CustomParagraphFilds = attributes.CustomParagraphFilds,
                CustomNumberFields = attributes.CustomNumberFields,

                CustomCheckboxFields = attributes.CustomCheckboxFields,
                CustomDropdownFields = attributes.CustomDropdownFields,
                CustomDropdownDependenciesFields = attributes.CustomDropdownDependenciesFields,
            };

            var userFields = new List<UserDto>();
            attributes?.CustomUserFields?.ForEach(i => userFields.Add(
                _mapper.Map<UserDto>(
                    _dbContext.Users.FirstOrDefault(u => u.Id == i))));

            customFields.CustomUserFields = userFields;

            task.CustomFields = customFields;
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

