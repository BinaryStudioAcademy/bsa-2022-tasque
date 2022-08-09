using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.JWT
{
    public class JwtFactory
    {
        public readonly IConfiguration _config;

        public JwtFactory(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(object user) //Replace object to UserModel (not UserLogin_model)
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

        public object Authenticate(object credentials)
        {
            //// Here you should place linq request to get user entity from DbContext using User Login and Password
            //    if (entity != null) //Use this method to return User entity. Before this <<if>> place linq to get entity from DBContext by login and password
            //        return entity; //Also replace object which shoud get in this method with UserLoginModel, which has user Login and Password
            return null; ////If user Entity not found it will return null, so you can throw excepption here(for example you can create custom NotFFoundException and throw it), by the way GlobalErrorExceptionHandler should handle this exception.
        }
    }
}
