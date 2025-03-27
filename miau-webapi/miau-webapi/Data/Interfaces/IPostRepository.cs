using miau_webapi.Models;
using Microsoft.Extensions.Hosting;

namespace miau_webapi.Data.Interfaces
{
    public interface IPostRepository
    {
        Task<PostModel> CreatePost(PostModel post);
        Task<PostModel> GetPostById(int id);
        Task<bool> ToggleLike(int userId, int postId); 
        Task<bool> HasLiked(int userId, int postId);
        Task IncrementViews(int postId);
        Task<List<PostModel>> GetPosts(int page, int pageSize = 10, int? userId = null);
        Task<CommentModel> CreateComment(int userId, int postId, string content);
    }

}
