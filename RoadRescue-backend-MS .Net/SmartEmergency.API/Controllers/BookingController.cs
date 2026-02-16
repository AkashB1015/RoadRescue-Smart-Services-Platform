using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartEmergency.API.DTOs;
using SmartEmergency.API.Services;
using System.Security.Claims;

namespace SmartEmergency.API.Controllers
{
    [Route("api/booking")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly SmartEmergency.API.Data.ApplicationDbContext _context;

        public BookingController(BookingService bookingService, SmartEmergency.API.Data.ApplicationDbContext context)
        {
            _bookingService = bookingService;
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] BookingDto dto)
        {
            Console.WriteLine($"[Booking Create] Received: Type={dto.ServiceType}, Loc={dto.Location}, Notes={dto.Notes}");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var booking = await _bookingService.CreateBookingAsync(userId, dto);

            Console.WriteLine($"[Booking Create] Created ID: {booking.BookingId}");

            return Ok(booking);

        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserBookings()
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var bookings = await _bookingService.GetUserBookingsAsync(userId);

            return Ok(bookings);

        }

      
        [HttpGet("available")]
        [Authorize(Roles = "SERVICE_PROVIDER,ADMIN")] 
        public async Task<IActionResult> GetAvailableBookings()
        {
             var bookings = await _bookingService.GetAvailableBookingsAsync();
             return Ok(bookings);
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = "SERVICE_PROVIDER")]
        public async Task<IActionResult> GetMyProviderBookings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var bookings = await _bookingService.GetProviderBookingsAsync(userId);

            return Ok(bookings);

        }

      
        [HttpGet("all")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAllBookings()
        {

            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);

        }


        [HttpPut("{id}/accept")]
        [Authorize(Roles = "SERVICE_PROVIDER")]
        public async Task<IActionResult> AcceptBooking(int id)
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var success = await _bookingService.AcceptBookingAsync(id, userId);

            if (!success) return BadRequest("Booking not found or already assigned.");

            return Ok(new { message = "Booking accepted successfully." });

        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "SERVICE_PROVIDER")]
        public async Task<IActionResult> CompleteBooking(int id)
        {
           
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var success = await _bookingService.CompleteBookingAsync(id, userId);

            if (!success) return BadRequest("Booking not found or unauthorized.");

            return Ok(new { message = "Booking completed successfully." });

        }


        [HttpPost("{id}/rate")]
        public async Task<IActionResult> RateBooking(int id, [FromBody] RateBookingDto dto)
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null) return NotFound("Booking not found.");

            if (booking.UserId != userId) return Forbid();

            if (!booking.IsPaid) return BadRequest("You can only rate paid bookings.");


            booking.Rating = dto.Rating;
            booking.Review = dto.Review;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Rating submitted successfully." });
        }
    }
}
