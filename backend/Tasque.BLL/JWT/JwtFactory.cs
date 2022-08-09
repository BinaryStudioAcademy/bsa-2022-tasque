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

        public string GenerateToken(object user)
        {
            var jwtOptions = _config.GetSection("JwtIssuerOptions");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("JWTIssuerOptions")["Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new Claim[] { };

            var token = new JwtSecurityToken(jwtOptions["Issuer"],
                jwtOptions["Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public object Authenticate(object credentials)
        {
            throw new NotImplementedException();
        }
    }
}
