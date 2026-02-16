package com.smartemergency.service;

import com.smartemergency.dto.LoginDto;
import com.smartemergency.dto.RegisterDto;
import com.smartemergency.entities.User;
import com.smartemergency.repository.UserRepository;
import com.smartemergency.custom_exceptions.AuthenticationException;
import com.smartemergency.custom_exceptions.InvalidInputException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final org.modelmapper.ModelMapper modelMapper;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Simple in-memory storage for OTPs: Email -> OTP
    private final java.util.Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @Override
    public String register(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new InvalidInputException("Email already exists.");
        }

        User user = modelMapper.map(dto, User.class);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(user);
        return "Success";
    }

    @Override
    public String login(LoginDto dto) {
        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(dto.getPassword(), userOpt.get().getPasswordHash())) {
            throw new AuthenticationException("Invalid credentials");
        }

        return generateJwtToken(userOpt.get());
    }

    @Override
    public String forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new InvalidInputException("User with this email not found.");
        }

        User user = userOpt.get();
        // Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        // Store OTP
        otpStorage.put(email, otp);

        // Send Email
        String subject = "RoadRescue - Password Reset OTP";
        String text = "Hello " + user.getName() + ",\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP is valid for a short duration.\n\n" +
                "Regards,\nRoadRescue Team";

        emailService.sendEmail(email, subject, text);

        return "Success";
    }

    @Override
    public String resetPassword(String email, String otp, String newPassword) {
        String storedOtp = otpStorage.get(email);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new InvalidInputException("Invalid or expired OTP.");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new InvalidInputException("User not found.");
        }

        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clear OTP after successful reset
        otpStorage.remove(email);

        return "Success";
    }

    private String generateJwtToken(User user) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(user.getUserId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("name", user.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}