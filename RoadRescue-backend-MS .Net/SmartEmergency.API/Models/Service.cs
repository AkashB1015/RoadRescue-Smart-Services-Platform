using System.ComponentModel.DataAnnotations;

namespace SmartEmergency.API.Models
{
    public class Service
    {
        public int ServiceId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Price { get; set; } = string.Empty;

        public string Icon { get; set; } = "bi-gear-fill"; // Default icon
    }
}
