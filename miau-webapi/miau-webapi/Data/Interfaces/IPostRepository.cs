using miau_webapi.Models;
using Microsoft.Extensions.Hosting;

namespace miau_webapi.Data.Interfaces
{
    public interface IPostRepository
    {
        Task<PostModel> CreatePost(PostModel post);
    }
}
