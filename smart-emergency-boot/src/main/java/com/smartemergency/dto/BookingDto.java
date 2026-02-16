package com.smartemergency.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingDto {
    @NotBlank(message = "Service Type is required")
    private String serviceType;

    @NotNull(message = "Booking Date is required")
    private LocalDateTime bookingDate;

    private String location;
    private String notes;
}
