package com.smartemergency.service;

import com.smartemergency.dto.BookingDto;
import com.smartemergency.entities.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Integer userId, BookingDto dto);
    boolean acceptBooking(Integer bookingId, Integer serviceProviderId);
    boolean completeBooking(Integer bookingId, Integer serviceProviderId);
    List<Booking> getUserBookings(Integer userId);
    List<Booking> getAvailableBookings();
    List<Booking> getProviderBookings(Integer providerId);
    List<Booking> getAllBookings();
}