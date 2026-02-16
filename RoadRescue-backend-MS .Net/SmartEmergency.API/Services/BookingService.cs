using Microsoft.EntityFrameworkCore;
using SmartEmergency.API.Data;
using SmartEmergency.API.DTOs;
using SmartEmergency.API.Models;

namespace SmartEmergency.API.Services
{
    public class BookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> CreateBookingAsync(int userId, BookingDto dto)
        {
            var booking = new Booking
            {
                UserId = userId,
                ServiceType = dto.ServiceType,
                BookingDate = dto.BookingDate,
                Location = dto.Location,
                Notes = dto.Notes,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<bool> AcceptBookingAsync(int bookingId, int serviceProviderId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;
            
            // Ensure booking is not already assigned
            if (booking.ServiceProviderId != null) return false;

            booking.Status = "Assigned";
            booking.ServiceProviderId = serviceProviderId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CompleteBookingAsync(int bookingId, int serviceProviderId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;

             // Ensure ONLY the assigned provider can complete it
            if (booking.ServiceProviderId != serviceProviderId) return false;

            booking.Status = "Resolved";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Booking>> GetUserBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }

        // Returns ONLY available (unassigned) bookings
        public async Task<List<Booking>> GetAvailableBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Where(b => b.Status == "Pending" && b.ServiceProviderId == null)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }

        // Returns bookings assigned to a specific provider
        public async Task<List<Booking>> GetProviderBookingsAsync(int providerId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Where(b => b.ServiceProviderId == providerId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }
        
        // Admin or fallback: get truly ALL
        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User) // Include user details for contact info
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }
    }
}
