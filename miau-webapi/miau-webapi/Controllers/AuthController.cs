using miau_webapi.DTOs.Auth;
using miau_webapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace miau_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly TokenService _tokenService;

        public AuthController(AuthService authService, TokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _authService.Register(request.Username, request.Email, request.Password);
                var token = _tokenService.GenerateToken(user);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.Login(request.Username, request.Password);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }

                var user = await _authService.GetUserById(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Usuário não encontrado." });
                }

                return Ok(new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("validate")]
        public IActionResult VerifyToken()
        {
            try
            {
                string authHeader = Request.Headers["Authorization"];
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token não fornecido ou inválido." });
                }

                string token = authHeader.Substring("Bearer ".Length).Trim();
                var principal = _tokenService.ValidateToken(token);

                if (principal == null)
                {
                    return Unauthorized(new { message = "Token inválido ou expirado." });
                }

                return Ok(new { message = "Token válido." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
