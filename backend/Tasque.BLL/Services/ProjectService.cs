using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    public ProjectService(DataContext db) : base(db)
    {

    }
}
