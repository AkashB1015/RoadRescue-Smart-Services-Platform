package com.smartemergency.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(nullable = false)
    private String serviceType;

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    private String location;
    private String notes;
    private String status = "Confirmed";

    private Integer serviceProviderId;

    @com.fasterxml.jackson.annotation.JsonProperty("isPaid")
    @Column(nullable = false)
    private boolean isPaid = false;

    private String paymentId;

    private Integer rating;
    private String review;

    @Transient
    private String providerName;
}