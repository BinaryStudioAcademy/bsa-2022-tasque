using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services.Project;

public class ProjectService : EntityCrudService<Common.Entities.Project>
{
    public ProjectService(DataContext db) : base(db)
    {
    }
}