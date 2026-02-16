using System.ComponentModel.DataAnnotations;

namespace SmartEmergency.API.DTOs
{
    public class RateBookingDto
    {
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        public string? Review { get; set; }
    }
}
