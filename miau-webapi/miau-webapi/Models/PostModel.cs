using System.Text.Json.Serialization;

namespace miau_webapi.Models
{
    public class PostModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string CatName { get; set; }
        public int Age { get; set; }
        public decimal Weight { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int Views { get; set; }
        public int Likes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public UserModel User { get; set; }
        public List<CommentModel> Comments { get; set; }

        [JsonIgnore]
        public List<PostLike> PostLikes { get; set; }
    }
}
