package com.smartemergency.service;

import com.smartemergency.dto.BookingDto;
import com.smartemergency.entities.Booking;
import com.smartemergency.entities.User;
import com.smartemergency.repository.BookingRepository;
import com.smartemergency.repository.UserRepository;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final org.modelmapper.ModelMapper modelMapper;

    @Override
    public Booking createBooking(Integer userId, BookingDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = modelMapper.map(dto, Booking.class);
        booking.setUser(user);
        booking.setStatus("Pending");

        return bookingRepository.save(booking);
    }

    @Override
    public boolean acceptBooking(Integer bookingId, Integer serviceProviderId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty())
            return false;

        Booking booking = bookingOpt.get();
        if (booking.getServiceProviderId() != null)
            return false;

        booking.setStatus("Assigned");
        booking.setServiceProviderId(serviceProviderId);
        bookingRepository.save(booking);
        return true;
    }

    @Override
    public boolean completeBooking(Integer bookingId, Integer serviceProviderId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty())
            return false;

        Booking booking = bookingOpt.get();
        if (!booking.getServiceProviderId().equals(serviceProviderId))
            return false;

        booking.setStatus("Resolved");
        bookingRepository.save(booking);
        return true;
    }

    @Override
    public List<Booking> getUserBookings(Integer userId) {
        return bookingRepository.findByUserUserIdOrderByBookingDateDesc(userId);
    }

    @Override
    public List<Booking> getAvailableBookings() {
        return bookingRepository.findByStatusAndServiceProviderIdIsNullOrderByBookingDateDesc("Pending");
    }

    @Override
    public List<Booking> getProviderBookings(Integer providerId) {
        return bookingRepository.findByServiceProviderIdOrderByBookingDateDesc(providerId);
    }

    @Override
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllByOrderByBookingDateDesc();
        bookings.forEach(this::loadProviderName);
        return bookings;
    }

    private void loadProviderName(Booking booking) {
        if (booking.getServiceProviderId() != null) {
            userRepository.findById(booking.getServiceProviderId())
                    .ifPresent(user -> booking.setProviderName(user.getName()));
        }
    }
}