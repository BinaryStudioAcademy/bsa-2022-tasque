using Tasque.Core.Identity.Services.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.Identity.Services.Implementation
{
    public class UserService : EntityCrudService<User>, IUserService
    {
        public UserService(DataContext db) : base(db) { }

        public User? GetByEmail(string email)
        {
            return _db.Users.FirstOrDefault(u => u.Email == email);
        }
    }
}
