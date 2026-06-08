using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PS5Tracker.API.Data;
using PS5Tracker.API.Models;

namespace PS5Tracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GamesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/games -> Όλα τα παιχνίδια
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var games = await _context.Games.ToListAsync();
            return Ok(games);
        }

        // GET /api/games/1 -> Ένα παιχνίδι
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
                return NotFound($"No game with Id {id} was found");

            return Ok(game);
        }

        // POST /api/games -> Προσθήκη Παιχνιδιού
        [HttpPost]
        public async Task<IActionResult> Create(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id =  game.Id }, game);
        }

        // PUT /api/games/1 -> Ενημέρωση παιχνιδιού
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Game game)
        {
            if (id != game.Id)
                return BadRequest("The ID is not matching.");

            _context.Entry(game).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/games/1 -> Διαγραφή Παιχνιδιού
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
                return NotFound($"Game with ID {id} was not found.");

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
