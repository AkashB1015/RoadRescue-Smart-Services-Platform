using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartEmergency.API.Models;
using SmartEmergency.API.Services;
using System.Security.Claims;

namespace SmartEmergency.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthService _authService;

        public UserController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Verify Admin role manually if [Authorize(Roles="ADMIN")] is tricky with claims
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? 

                       User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

            if (role != "ADMIN") return Forbid("Admin access only.");

            var users = await _authService.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {

             var role = User.FindFirst(ClaimTypes.Role)?.Value ?? 
                       User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;


            if (role != "ADMIN") return Forbid("Admin access only.");


            var success = await _authService.DeleteUserAsync(id);

            if (!success) return NotFound("User not found.");


            return Ok(new { message = "User deleted successfully." });
        }
    }
}
