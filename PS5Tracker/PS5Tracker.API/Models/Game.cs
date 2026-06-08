
namespace PS5Tracker.API.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Genre { get; set; }
        public string Status { get; set; } = "ToPlay";
        public int? Rating { get; set; }
        public string? Notes { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        public DateTime? DateFinished { get; set; }
    }
}
