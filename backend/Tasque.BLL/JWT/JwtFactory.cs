using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Tasque.Core.BLL.JWT
{
    public class JwtFactory
    {
        public readonly JwtIssuerOptions _jwtOptions;

        public JwtFactory(JwtIssuerOptions jwtOptions)
        {
            _jwtOptions = jwtOptions;
        }

        public string GenerateToken(int id, string username, string email)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                 new Claim(JwtRegisteredClaimNames.Sub, username),
                 new Claim(JwtRegisteredClaimNames.Email, email),
                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                 new Claim("id", id.ToString())
             };

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
