using Microsoft.Extensions.Hosting;

namespace miau_webapi.Models
{
    public class CommentModel
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public PostModel Post { get; set; }
        public UserModel User { get; set; }
    }
}
