package com.smartemergency.dto;

import lombok.Data;

@Data
public class PaymentVerificationDto {
    private Integer bookingId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}
