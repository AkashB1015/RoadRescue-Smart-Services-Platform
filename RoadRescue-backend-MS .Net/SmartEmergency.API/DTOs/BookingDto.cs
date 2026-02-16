using System.ComponentModel.DataAnnotations;

namespace SmartEmergency.API.DTOs
{
    public class BookingDto
    {
        [Required]
        public string ServiceType { get; set; } = string.Empty;
        
        [Required]
        public DateTime BookingDate { get; set; }

        public string? Location { get; set; }

        public string? Notes { get; set; }
    }
}
