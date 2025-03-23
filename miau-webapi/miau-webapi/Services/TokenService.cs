using DotNetEnv;
using miau_webapi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace miau_webapi.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public object GenerateToken(UserModel user)
        {

            string secret = _configuration["Jwt:SecretKey"];

            var key = Encoding.ASCII.GetBytes(secret);
            var tokenConfig = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                {
                    new Claim("userId", user.Id.ToString()),
                    new Claim("username", user.Username),
                }),
                Expires = System.DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenConfig);
            var tokenString = tokenHandler.WriteToken(token);
            return new
            {
                token = tokenString
            };
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            try
            {
                string secret = _configuration["Jwt:SecretKey"];

                var key = Encoding.ASCII.GetBytes(secret);

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true, 
                    ClockSkew = TimeSpan.Zero 
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch (Exception)
            {
                return null; 
            }
        }
    }
}
