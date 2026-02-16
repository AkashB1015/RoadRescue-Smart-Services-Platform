using System.ComponentModel.DataAnnotations;

namespace SmartEmergency.API.Models
{
    public class User
    {
        public int UserId { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "USER"; // USER, SERVICE_PROVIDER, ADMIN
    }
}
