package com.smartemergency.repository;

import com.smartemergency.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserIdOrderByBookingDateDesc(Integer userId);

    List<Booking> findByStatusAndServiceProviderIdIsNullOrderByBookingDateDesc(String status);

    List<Booking> findByServiceProviderIdOrderByBookingDateDesc(Integer serviceProviderId);

    List<Booking> findAllByOrderByBookingDateDesc();
}
