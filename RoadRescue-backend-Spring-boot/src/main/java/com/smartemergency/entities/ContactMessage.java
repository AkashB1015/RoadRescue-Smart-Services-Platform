package com.smartemergency.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ContactMessages")
@Data
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    @jakarta.validation.constraints.Pattern(regexp = "^[1-9][0-9]{9}$", message = "Phone number must be 10 digits and not start with 0")
    private String phone;
    private String message;

    private String status = "Pending";

    private LocalDateTime createdAt = LocalDateTime.now();
}