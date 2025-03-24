using miau_webapi.Models;
using Microsoft.EntityFrameworkCore;

namespace miau_webapi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<PostModel> Posts { get; set; }
        public DbSet<CommentModel> Comments { get; set; }
    }
}
