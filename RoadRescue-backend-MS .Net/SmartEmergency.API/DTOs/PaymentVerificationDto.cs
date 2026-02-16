namespace SmartEmergency.API.DTOs
{
    public class PaymentVerificationDto
    {
        public int BookingId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}
