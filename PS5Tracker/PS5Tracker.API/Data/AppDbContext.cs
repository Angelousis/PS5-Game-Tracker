
using Microsoft.EntityFrameworkCore;
using PS5Tracker.API.Models;

namespace PS5Tracker.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Game> Games { get; set; }
    }
}

