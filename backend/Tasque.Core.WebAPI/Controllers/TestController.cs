using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services.Auth;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/test")]
    [AllowAnonymous]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly DataContext _context;
        public TestController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("ping")]
        public string Ping()
        {
            return "pong";
        }

        [HttpGet("test")]
        public List<User> Test()
         {
            return _context.Users.ToList();
        }
    }
}
