using miau_webapi.Data.Interfaces;
using miau_webapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace miau_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly PostService _postService;
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;

        public PostsController(PostService postService, IPostRepository postRepository, IUserRepository userRepository)
        {
            _postService = postService;
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? userId = null)
        {
            try
            {

                int? parsedUserId = null;

                if (!string.IsNullOrEmpty(userId))
                {
                    if (int.TryParse(userId, out int intUserId))
                    {
                        parsedUserId = intUserId;
                    }
                    else
                    {
                        var user = await _userRepository.GetUserByUsername(userId);
                        if (user != null)
                        {
                            parsedUserId = user.Id;
                        }
                    }
                }

                var posts = await _postService.GetPosts(page, pageSize, parsedUserId);

                var userIdClaim = User.FindFirst("userId")?.Value;
                int? currentUserId = string.IsNullOrEmpty(userIdClaim) ? null : int.Parse(userIdClaim);

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
                    userName = post.User?.Username,
                    hasLiked = hasLiked,
                    comments = comments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public static string DecodeUnicodeString(string input)
        {
            return Regex.Replace(input, @"\\u([0-9A-Fa-f]{4,5})", match =>
            {
                return char.ConvertFromUtf32(Convert.ToInt32(match.Groups[1].Value, 16));
            });
        }

        [HttpPost("{postId}/comments")]
        [Authorize]
        public async Task<IActionResult> CreateComment(int postId, [FromBody] CreateCommentRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                var username = User.FindFirst("username")?.Value;
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
                    createdAt = comment.CreatedAt,
                    username = username,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{postId}/comment-suggestion")]
        public async Task<IActionResult> GetCommentSuggestion(int postId)
        {
            try
            {
                var post = await _postRepository.GetPostById(postId);
                if (post == null)
                {
                    return NotFound(new { message = "Post não encontrado." });
                }

                var suggestion = await _postService.GetCommentSuggestion(post.CatName, post.Description);
                return Ok(new { suggestion });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        

        [HttpDelete("{postId}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int postId)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }

                var post = await _postRepository.GetPostById(postId);
                if (post == null)
                {
                    return NotFound(new { message = "Post não encontrado." });
                }

                if (post.UserId != userId)
                {
                    return Forbid("Você não tem permissão para excluir este post.");
                }

                var success = await _postRepository.Delete(postId);
                if (!success)
                {
                    return BadRequest(new { message = "Erro ao excluir o post." });
                }
                return Ok(new { message = "Post deletado com sucesso." });
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
