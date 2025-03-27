using Microsoft.Extensions.Hosting;

namespace miau_webapi.Models
{
   
        public class PostLike
        {
            public int UserId { get; set; }
            public int PostId { get; set; }
            public UserModel User { get; set; }
            public PostModel Post { get; set; }
        }
    
}
