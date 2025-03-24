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
            // Fazer upload da imagem para o Cloudinary
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "catsphere/posts" // Opcional: organizar imagens em uma pasta
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception("Erro ao fazer upload da imagem para o Cloudinary.");
            }

            // Criar o objeto Post com a URL da imagem
            var post = new PostModel
            {
                UserId = userId,
                CatName = catName,
                Age = age,
                Weight = weight,
                Description = description,
                ImageUrl = uploadResult.SecureUrl.ToString(), // URL segura da imagem
                Views = 0,
                Likes = 0,
                CreatedAt = DateTime.UtcNow
            };

            // Salvar no banco
            return await _postRepository.CreatePost(post);
        }
    }
}
