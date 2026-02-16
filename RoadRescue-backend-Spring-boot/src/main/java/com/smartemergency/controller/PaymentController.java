package com.smartemergency.controller;

import com.smartemergency.dto.PaymentRequestDto;
import com.smartemergency.dto.PaymentVerificationDto;
import com.smartemergency.service.PaymentService;
import com.smartemergency.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequestDto request) {
        try {
            String orderId = paymentService.createOrder(request);
            return ResponseEntity.ok(Map.of("orderId", orderId, "key", paymentService.getKey()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse("Error creating order: " + e.getMessage(), "Failed"));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto dto) {
        System.out.println("Received verify payment request: " + dto);
        boolean success = paymentService.verifyPayment(dto);
        if (success) {
            return ResponseEntity.ok(new ApiResponse("Payment verified and booking updated.", "Success"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Payment verification failed.", "Failed"));
        }
    }
}
