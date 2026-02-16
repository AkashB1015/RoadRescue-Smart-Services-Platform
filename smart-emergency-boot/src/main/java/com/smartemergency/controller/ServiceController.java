package com.smartemergency.controller;

import com.smartemergency.entities.Service;
import com.smartemergency.repository.ServiceRepository;
import com.smartemergency.dto.ApiResponse;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepository;

    @GetMapping
    public List<Service> getServices() {
    	
        return serviceRepository.findAll();
        
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
    	
        Service savedService = serviceRepository.save(service);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedService.getServiceId())
                .toUri();
        return ResponseEntity.created(location).body(savedService);
        
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@PathVariable Integer id, @RequestBody Service service) {
    	
        if (!id.equals(service.getServiceId())) {
        	
            return ResponseEntity.badRequest().body(new ApiResponse("ID mismatch", "Failed"));
            
        }
        
        if (!serviceRepository.existsById(id)) {
        	
            throw new ResourceNotFoundException("Service not found");
            
        }
        serviceRepository.save(service);
        return ResponseEntity.ok(new ApiResponse("Service updated successfully", "Success"));
        
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable Integer id) {
    	
        if (!serviceRepository.existsById(id)) {
        	
            throw new ResourceNotFoundException("Service not found");
            
        }
        
        serviceRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Service deleted successfully", "Success"));
        
    }
}
