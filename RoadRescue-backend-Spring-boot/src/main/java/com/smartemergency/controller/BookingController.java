package com.smartemergency.controller;

import com.smartemergency.dto.BookingDto;
import com.smartemergency.dto.RateBookingDto;
import com.smartemergency.entities.Booking;
import com.smartemergency.repository.BookingRepository;
import com.smartemergency.service.BookingService;
import com.smartemergency.dto.ApiResponse;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Integer.parseInt(auth.getName());
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody BookingDto dto) {
        Integer userId = getCurrentUserId();
        Booking booking = bookingService.createBooking(userId, dto);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<List<Booking>> getAvailableBookings() {
        return ResponseEntity.ok(bookingService.getAvailableBookings());
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<List<Booking>> getMyProviderBookings() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getProviderBookings(userId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<?> acceptBooking(@PathVariable Integer id) {
        Integer userId = getCurrentUserId();
        boolean success = bookingService.acceptBooking(id, userId);
        if (!success)
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Booking not found or already assigned.", "Failed"));
        return ResponseEntity.ok(new ApiResponse("Booking accepted successfully.", "Success"));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<?> completeBooking(@PathVariable Integer id) {
        Integer userId = getCurrentUserId();
        boolean success = bookingService.completeBooking(id, userId);
        if (!success)
            return ResponseEntity.badRequest().body(new ApiResponse("Booking not found or unauthorized.", "Failed"));
        return ResponseEntity.ok(new ApiResponse("Booking completed successfully.", "Success"));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateBooking(@PathVariable Integer id, @RequestBody RateBookingDto dto) {
        Integer userId = getCurrentUserId();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId))
            return ResponseEntity.status(403).body(new ApiResponse("Unauthorized access", "Failed"));
        if (!booking.isPaid())
            return ResponseEntity.badRequest().body(new ApiResponse("You can only rate paid bookings.", "Failed"));

        booking.setRating(dto.getRating());
        booking.setReview(dto.getReview());
        bookingRepository.save(booking);

        return ResponseEntity.ok(new ApiResponse("Rating submitted successfully.", "Success"));
    }
}
