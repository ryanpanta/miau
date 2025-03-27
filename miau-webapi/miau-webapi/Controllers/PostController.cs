using miau_webapi.Data.Interfaces;
using miau_webapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace miau_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly PostService _postService;
        private readonly IPostRepository _postRepository;

        public PostsController(PostService postService, IPostRepository postRepository)
        {
            _postService = postService;
            _postRepository = postRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? userId = null)
        {
            try
            {
                var posts = await _postService.GetPosts(page, pageSize, userId);

                var userIdClaim = User.FindFirst("userId")?.Value;
                int? currentUserId = string.IsNullOrEmpty(userIdClaim) ? (int?)null : int.Parse(userIdClaim);

                var postResponse = posts.Select(post => new
                {
                    id = post.Id,
                    userId = post.UserId,
                    username = post.Username,
                    catName = post.CatName,
                    age = post.Age,
                    weight = post.Weight,
                    description = post.Description,
                    imageUrl = post.ImageUrl,
                    views = post.Views,
                    likes = post.Likes,
                    createdAt = post.CreatedAt,
                    hasLiked = currentUserId.HasValue && post.PostLikes.Any(pl => pl.UserId == currentUserId.Value)
                }).ToList();

                return Ok(new
                {
                    posts = postResponse,
                    page,
                    pageSize,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest request)
        {
            try
            {

                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }


                if (request.Image == null || request.Image.Length == 0)
                {
                    return BadRequest(new { message = "Imagem é obrigatória." });
                }


                var post = await _postService.CreatePost(
                    userId,
                    request.CatName,
                    request.Age,
                    request.Weight,
                    request.Description,
                    request.Image
                );


                return Ok(new
                {
                    id = post.Id,
                    userId = post.UserId,
                    catName = post.CatName,
                    age = post.Age,
                    weight = post.Weight,
                    description = post.Description,
                    imageUrl = post.ImageUrl,
                    views = post.Views,
                    likes = post.Likes,
                    createdAt = post.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{postId}/like")]
        [Authorize]
        public async Task<IActionResult> LikePost(int postId)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }

                var success = await _postService.ToggleLike(userId, postId);
                if (!success)
                {
                    return BadRequest(new { message = "Post não encontrado." });
                }

                var hasLiked = await _postService.HasLiked(userId, postId);
                return Ok(new { message = hasLiked ? "Like adicionado com sucesso." : "Like removido com sucesso.", hasLiked });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostDetails(int postId)
        {
            try
            {
                var post = await _postRepository.GetPostById(postId);
                if (post == null)
                {
                    return NotFound(new { message = "Post não encontrado." });
                }

                await _postRepository.IncrementViews(postId);

                var userIdClaim = User.FindFirst("userId")?.Value;
                bool hasLiked = false;

                if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int userId))
                {
                    hasLiked = await _postService.HasLiked(userId, postId);
                }

                var comments = post.Comments.Select(c => new
                {
                    id = c.Id,
                    userId = c.UserId,
                    username = c.User?.Username, 
                    content = c.Content,
                    createdAt = c.CreatedAt
                }).ToList();

                return Ok(new
                {
                    id = post.Id,
                    userId = post.UserId,
                    catName = post.CatName,
                    age = post.Age,
                    weight = post.Weight,
                    description = post.Description,
                    imageUrl = post.ImageUrl,
                    views = post.Views,
                    likes = post.Likes,
                    createdAt = post.CreatedAt,
                    hasLiked = hasLiked,
                    comments = comments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{postId}/comments")]
        [Authorize]
        public async Task<IActionResult> CreateComment(int postId, [FromBody] CreateCommentRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }

                var comment = await _postService.CreateComment(userId, postId, request.Content);

                return Ok(new
                {
                    id = comment.Id,
                    postId = comment.PostId,
                    userId = comment.UserId,
                    content = comment.Content,
                    createdAt = comment.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
    public class CreatePostRequest
    {
        public string CatName { get; set; }
        public int Age { get; set; }
        public decimal Weight { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }

    public class CreateCommentRequest
    {
        public string Content { get; set; }
    }
}
