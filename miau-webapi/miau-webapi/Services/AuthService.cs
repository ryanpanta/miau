using BCrypt.Net;
using miau_webapi.Data.Interfaces;
using miau_webapi.Models;

namespace miau_webapi.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;

        public AuthService(IUserRepository userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<UserModel> Register(string username, string email, string password)
        {
            var existingUser = await _userRepository.GetUserByUsername(username);
            if (existingUser != null)
            {
                throw new Exception("Usuário já cadastrado.");
            }

            var user = new UserModel
            {
                Username = username,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password)
            };

            return await _userRepository.Register(user);
        }

        public async Task<object> Login(string username, string password)
        {
            var user = await _userRepository.GetUserByUsername(username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                throw new Exception("Usuário ou senha inválidos.");
            }

            return _tokenService.GenerateToken(user);
        }

        public async Task<UserModel> GetUserById(int id)
        {
            return await _userRepository.GetUserById(id);
        }
    }
}
