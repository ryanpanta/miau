﻿using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using miau_webapi.Data.Interfaces;
using Microsoft.Extensions.Hosting;
using miau_webapi.Models;
using DotNetEnv;
using System.Net.Http;
using System.Text;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

namespace miau_webapi.Services
{
    public class PostService
    {
        private readonly IPostRepository _postRepository;
        private readonly Cloudinary _cloudinary;
        private readonly IUserRepository _userRepository;

        public PostService(IPostRepository postRepository, Cloudinary cloudinary, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _cloudinary = cloudinary;
            _userRepository = userRepository;
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

            var user = await _userRepository.GetUserById(userId);

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
                CreatedAt = DateTime.UtcNow,
                User = user,
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

        public async Task<string> GetCommentSuggestion(string catName, string description)
        {
            var endpoint = new Uri("https://models.inference.ai.azure.com");
            var credentialString = Environment.GetEnvironmentVariable("GITHUB_TOKEN");
            var model = "gpt-4o";
            var credential = new ApiKeyCredential(credentialString);
            var openAIOptions = new OpenAIClientOptions()
            {
                Endpoint = endpoint
            };

            var client = new ChatClient(model, credential, openAIOptions);

            List<ChatMessage> messages = new List<ChatMessage>()
            {
                new SystemChatMessage("You are a helpful assistant."),
                new UserChatMessage($"Gere uma sugestão de comentário positivo e criativo para uma foto de um gato chamado '{catName}' com a descrição '{description}'. Se não tiver dados suficientes para algo específico, retorne uma mensagem genérica como 'Que foto legal!' ou 'Que gato lindo!'."),
            };

            var requestOptions = new ChatCompletionOptions()
            {
                Temperature = 1.0f,
                TopP = 1.0f,
                MaxOutputTokenCount = 100,
            };

            var response = client.CompleteChat(messages, requestOptions);
            var suggestion = response.Value.Content[0].Text;

            
            return string.IsNullOrEmpty(suggestion) ? "Que gato lindo!" : suggestion;
        }

    }
}
