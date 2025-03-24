using Microsoft.Extensions.Hosting;

namespace miau_webapi.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public List<PostModel> Posts { get; set; }
        public List<CommentModel> Comments { get; set; }
    }
}
