package com.smartemergency.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDto {
    private Integer bookingId;
    private BigDecimal amount;
}
