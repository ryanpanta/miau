using miau_webapi.Models;

namespace miau_webapi.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<UserModel> Register(UserModel user);
        Task<UserModel> GetUserByUsername(string username);
        Task<UserModel> GetUserById(int id);
    }
}
