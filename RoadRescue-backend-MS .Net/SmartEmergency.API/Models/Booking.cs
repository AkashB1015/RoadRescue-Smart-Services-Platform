using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartEmergency.API.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
        
        [Required]
        public string ServiceType { get; set; } = string.Empty;
        
        public DateTime BookingDate { get; set; }

        public string? Location { get; set; }

        public string? Notes { get; set; }
        
        public string Status { get; set; } = "Confirmed";

        public int? ServiceProviderId { get; set; } // Nullable, as it is initially unassigned
        
        public bool IsPaid { get; set; } = false;
        
        public string? PaymentId { get; set; }

        public int? Rating { get; set; }
        
        public string? Review { get; set; }
    }
}
