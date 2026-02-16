package com.smartemergency.controller;

import com.smartemergency.dto.LoginDto;
import com.smartemergency.dto.RegisterDto;
import com.smartemergency.service.AuthService;
import com.smartemergency.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto dto) {
        String result = authService.register(dto);
        return ResponseEntity.ok(new ApiResponse(result, "Success"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        String token = authService.login(dto);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.smartemergency.dto.ForgotPasswordDto dto) {
        String result = authService.forgotPassword(dto.getEmail());
        return ResponseEntity.ok(new ApiResponse(result, "Success"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.smartemergency.dto.ResetPasswordDto dto) {
        String result = authService.resetPassword(dto.getEmail(), dto.getOtp(), dto.getNewPassword());
        return ResponseEntity.ok(new ApiResponse(result, "Success"));
    }
}
