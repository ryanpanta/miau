using miau_webapi.Data.Interfaces;
using miau_webapi.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Data;

namespace miau_webapi.Data.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;

        public PostRepository(AppDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<PostModel> CreatePost(PostModel post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<PostModel> GetPostById(int id)
        {
            return await _context.Posts
                .Include(p => p.PostLikes)
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .Include(p => p.User) 
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> ToggleLike(int userId, int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return false; 
            }

            var existingLike = await _context.PostLikes
                .FirstOrDefaultAsync(pl => pl.UserId == userId && pl.PostId == postId);

            if (existingLike != null)
            {
                _context.PostLikes.Remove(existingLike);
                post.Likes -= 1;
            }
            else
            {
                _context.PostLikes.Add(new PostLike { UserId = userId, PostId = postId });
                post.Likes += 1;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasLiked(int userId, int postId)
        {
            return await _context.PostLikes
                .AnyAsync(pl => pl.UserId == userId && pl.PostId == postId);
        }

        public async Task IncrementViews(int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                post.Views++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<PostModel>> GetPosts(int page, int pageSize = 10, int? userId = null)
        {
            var query = _context.Posts.FromSqlRaw("SELECT * FROM vw_PostsWithUser")
                .AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(p => p.UserId == userId.Value);
            }

            return await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(p => p.PostLikes)
                .ToListAsync();
        }

        public async Task<CommentModel> CreateComment(int userId, int postId, string content)
        {
            var createdAt = DateTime.UtcNow;
            var newIdParam = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_CreateComment @UserId, @PostId, @Content, @CreatedAt, @NewId OUTPUT",
                new SqlParameter("@UserId", userId),
                new SqlParameter("@PostId", postId),
                new SqlParameter("@Content", content),
                new SqlParameter("@CreatedAt", createdAt),
                newIdParam
            );

            var newId = (int)newIdParam.Value;


            return new CommentModel
            {
                Id = newId,
                UserId = userId,
                PostId = postId,
                Content = content,
                CreatedAt = createdAt,
                User = await _userRepository.GetUserById(userId),
            };
        }

        public async Task<bool> Delete(int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
            {
                return false;
            }
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
