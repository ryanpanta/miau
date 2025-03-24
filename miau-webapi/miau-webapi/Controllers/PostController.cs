using miau_webapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace miau_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly PostService _postService;

        public PostsController(PostService postService)
        {
            _postService = postService;
        }

        [HttpPost]
        [Authorize] // Exige autenticação via JWT
        public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest request)
        {
            try
            {
                // Extrair o userId do token JWT
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Token inválido ou sem ID de usuário." });
                }

                // Verificar se a imagem foi enviada
                if (request.Image == null || request.Image.Length == 0)
                {
                    return BadRequest(new { message = "Imagem é obrigatória." });
                }

                // Chamar o serviço para criar o post
                var post = await _postService.CreatePost(
                    userId,
                    request.CatName,
                    request.Age,
                    request.Weight,
                    request.Description,
                    request.Image
                );

                // Retornar o post criado
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
    }

    // DTO para a requisição
    public class CreatePostRequest
    {
        public string CatName { get; set; }
        public int Age { get; set; }
        public decimal Weight { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }
}
