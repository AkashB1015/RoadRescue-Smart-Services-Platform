package com.smartemergency.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.smartemergency.dto.PaymentRequestDto;
import com.smartemergency.dto.PaymentVerificationDto;
import com.smartemergency.entities.Booking;
import com.smartemergency.repository.BookingRepository;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key}")
    private String keyId;

    @Value("${razorpay.secret}")
    private String keySecret;

    private final BookingRepository bookingRepository;

    @Override
    public String createOrder(PaymentRequestDto request) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount().multiply(new java.math.BigDecimal("100"))); // Amount in paise
        options.put("currency", "INR");
        options.put("receipt", "order_rcptid_" + request.getBookingId());
        options.put("payment_capture", 1);

        Order order = client.orders.create(options);
        return order.get("id");
    }

    @Override
    public String getKey() {
        return keyId;
    }

    @Override
    public boolean verifyPayment(PaymentVerificationDto dto) {
        System.out.println("Verifying payment for Booking ID: " + dto.getBookingId());
        Optional<Booking> bookingOpt = bookingRepository.findById(dto.getBookingId());
        if (bookingOpt.isEmpty()) {
            System.out.println("Booking not found for ID: " + dto.getBookingId());
            throw new ResourceNotFoundException("Booking not found for ID: " + dto.getBookingId());
        }

        Booking booking = bookingOpt.get();
        booking.setPaid(true);
        booking.setStatus("Resolved");
        booking.setPaymentId(dto.getRazorpayPaymentId());
        bookingRepository.save(booking);
        System.out.println("Payment verified and booking updated for ID: " + dto.getBookingId());
        return true;
    }
}