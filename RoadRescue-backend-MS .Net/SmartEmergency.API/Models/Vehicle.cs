using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartEmergency.API.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
        
        [Required]
        public string VehicleType { get; set; } = string.Empty; // Car, Bike, EV
        
        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;
    }
}
