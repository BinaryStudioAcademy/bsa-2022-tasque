using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenTestController : ControllerBase
    {
        private readonly IConfiguration _config;

        public TokenTestController(IConfiguration config)
        {
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] object credentials) //Replace <<object>> with UserLoginModel model, for example UserLogin, which has User login and password. Not More
        {
            var user = Authenticate(credentials);

            if(user != null)
            {
                var token = GenerateToken(user);
                return Ok(token);
            }
            return NotFound("Not found");
        }

        private string GenerateToken(object user) //Replace object to UserModel (not UserLogin_model)
        {
            var jwtOptions = _config.GetSection("JwtIssuerOptions");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("JWTIssuerOptions")["Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new Claim[] { };//here should be user data, except login and password, such as Name, email ect.

            var token = new JwtSecurityToken(jwtOptions["Issuer"],
                jwtOptions["Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private object Authenticate(object credentials)
        {
            //// Here you should place linq request to get user entity from DbContext using User Login and Password
            //    if (entity != null) //Use this method to return User entity. Before this <<if>> place linq to get entity from DBContext by login and password
            //        return entity; //Also replace object which shoud get in this method with UserLoginModel, which has user Login and Password
                return null; ////If user Entity not found it will return null, so you can throw excepption here(for example you can create custom NotFFoundException and throw it), by the way GlobalErrorExceptionHandler should handle this exception.
        }
    }
}
