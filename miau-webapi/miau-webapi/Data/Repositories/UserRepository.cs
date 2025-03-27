using miau_webapi.Data.Interfaces;
using miau_webapi.Models;
using Microsoft.EntityFrameworkCore;

namespace miau_webapi.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserModel> Register(UserModel user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<UserModel> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserModel> GetUserById(int id)
        {
            return await _context.Users
                .FromSqlRaw("SELECT * FROM fn_GetUserById({0})", id)
                .FirstOrDefaultAsync();
        }
    }
}
