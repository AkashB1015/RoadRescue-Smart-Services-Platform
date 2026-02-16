using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEmergency.API.Data;
using SmartEmergency.API.Models;

namespace SmartEmergency.API.Controllers
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContactForm([FromBody] ContactMessage message)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            message.CreatedAt = DateTime.UtcNow;

            message.Status = "Pending";

            _context.ContactMessages.Add(message);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully" });

        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
        {

            return await _context.ContactMessages.OrderByDescending(m => m.CreatedAt).ToListAsync();

        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ContactMessage updatedMessage)
        {

            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return NotFound();

            message.Status = updatedMessage.Status;

            await _context.SaveChangesAsync();

            return NoContent();

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteMessage(int id)

        {
            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return NotFound();


            _context.ContactMessages.Remove(message);

            await _context.SaveChangesAsync();

            return NoContent();

        }
    }
}
