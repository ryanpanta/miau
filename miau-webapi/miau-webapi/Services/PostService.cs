using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using miau_webapi.Data.Interfaces;
using Microsoft.Extensions.Hosting;
using miau_webapi.Models;

namespace miau_webapi.Services
{
    public class PostService
    {
        private readonly IPostRepository _postRepository;
        private readonly Cloudinary _cloudinary;

        public PostService(IPostRepository postRepository, Cloudinary cloudinary)
        {
            _postRepository = postRepository;
            _cloudinary = cloudinary;
        }

        public async Task<PostModel> CreatePost(int userId, string catName, int age, decimal weight, string description, IFormFile image)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "miau/posts"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception("Erro ao fazer upload da imagem para o Cloudinary.");
            }

            var post = new PostModel
            {
                UserId = userId,
                CatName = catName,
                Age = age,
                Weight = weight,
                Description = description,
                ImageUrl = uploadResult.SecureUrl.ToString(),
                Views = 0,
                Likes = 0,
                CreatedAt = DateTime.UtcNow
            };

            return await _postRepository.CreatePost(post);
        }
        public async Task<bool> ToggleLike(int userId, int postId)
        {
            return await _postRepository.ToggleLike(userId, postId);
        }

        public async Task<bool> HasLiked(int userId, int postId)
        {
            return await _postRepository.HasLiked(userId, postId);
        }

        public async Task<List<PostModel>> GetPosts(int page, int pageSize = 10, int? userId = null)
        {
            return await _postRepository.GetPosts(page, pageSize, userId);
        }
        public async Task<CommentModel> CreateComment(int userId, int postId, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new Exception("O comentário não pode estar vazio.");
            }

            var post = await _postRepository.GetPostById(postId);
            if (post == null)
            {
                throw new Exception("Post não encontrado.");
            }

            return await _postRepository.CreateComment(userId, postId, content);
        }

    }
}
