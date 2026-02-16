namespace SmartEmergency.API.DTOs
{
    public class PaymentRequestDto
    {
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
    }
}
