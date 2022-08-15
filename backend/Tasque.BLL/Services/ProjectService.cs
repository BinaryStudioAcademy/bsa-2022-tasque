using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Common.Entities.Project>
{
    public ProjectService(DataContext db) : base(db)
    {

    }
}
