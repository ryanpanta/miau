using miau_webapi.Data.Interfaces;
using miau_webapi.Models;
using Microsoft.Extensions.Hosting;

namespace miau_webapi.Data.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;

        public PostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PostModel> CreatePost(PostModel post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }
    }
}
