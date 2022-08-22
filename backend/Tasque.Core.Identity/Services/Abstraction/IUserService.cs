using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.Identity.Services.Abstraction
{
    public interface IUserService : IEntityCrudService<User>
    {
        User? GetByEmail(string email);
    }
}
