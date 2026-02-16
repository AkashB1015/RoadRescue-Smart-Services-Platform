using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEmergency.API.Data;
using SmartEmergency.API.Models;
using System.Security.Claims;

namespace SmartEmergency.API.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Service>> CreateService(Service service)
        {

            var role = GetUserRole();
            if (role != "ADMIN") return Forbid("Admin access only");

            _context.Services.Add(service);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServices), new { id = service.ServiceId }, service);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, Service service)
        {
            var role = GetUserRole();

            if (role != "ADMIN") return Forbid("Admin access only");

            if (id != service.ServiceId) return BadRequest();

            _context.Entry(service).State = EntityState.Modified;
            try
            {

                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {

                if (!_context.Services.Any(e => e.ServiceId == id)) return NotFound();
                else throw;

            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {

            var role = GetUserRole();

            if (role != "ADMIN") return Forbid("Admin access only");


            var service = await _context.Services.FindAsync(id);

            if (service == null) return NotFound();


            _context.Services.Remove(service);

            await _context.SaveChangesAsync();

            return NoContent();

        }

        private string? GetUserRole()
        {

             return User.FindFirst(ClaimTypes.Role)?.Value ?? 
                    User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

        }
    }
}
