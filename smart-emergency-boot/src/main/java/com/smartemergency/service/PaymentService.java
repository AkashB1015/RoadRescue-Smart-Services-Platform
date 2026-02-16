package com.smartemergency.service;

import com.smartemergency.dto.PaymentRequestDto;
import com.smartemergency.dto.PaymentVerificationDto;
import com.razorpay.RazorpayException;

public interface PaymentService {
    String createOrder(PaymentRequestDto request) throws RazorpayException;
    String getKey();
    boolean verifyPayment(PaymentVerificationDto dto);
}