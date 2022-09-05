using AutoMapper;
using Tasque.Core.DAL;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : EntityCrudService<Task>
    {
        private IMapper _mapper;
        public TaskService(DataContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }
    }
}
