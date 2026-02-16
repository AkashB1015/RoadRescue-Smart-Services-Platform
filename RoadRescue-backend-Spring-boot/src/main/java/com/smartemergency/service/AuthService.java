package com.smartemergency.service;

import com.smartemergency.dto.LoginDto;
import com.smartemergency.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto dto);
    String login(LoginDto dto);
    String forgotPassword(String email);
    String resetPassword(String email, String otp, String newPassword);
}