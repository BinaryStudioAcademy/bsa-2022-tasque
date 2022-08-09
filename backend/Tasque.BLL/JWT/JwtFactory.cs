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
        public readonly JwtIssuerOptions _jwtOptions;

        public JwtFactory(JwtIssuerOptions jwtOptions)
        {
            _jwtOptions = jwtOptions;
        }

        public string GenerateToken(object user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new Claim[] { };

            var token = new JwtSecurityToken(_jwtOptions.Issuer,
                _jwtOptions.Audience,
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
