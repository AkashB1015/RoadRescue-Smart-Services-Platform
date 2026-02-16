package com.smartemergency.controller;

import com.smartemergency.entities.ContactMessage;
import com.smartemergency.repository.ContactMessageRepository;
import com.smartemergency.service.ContactService;
import com.smartemergency.dto.ApiResponse;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactMessage message) {
        contactService.submitMessage(message);
        return ResponseEntity.ok(new ApiResponse("Message sent successfully", "Success"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactMessage> getMessages() {
        return contactService.getAllMessages();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody ContactMessage updatedMessage) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));
        message.setStatus(updatedMessage.getStatus());
        contactMessageRepository.save(message);
        return ResponseEntity.ok(new ApiResponse("Status updated successfully", "Success"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable Integer id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact message not found");
        }
        contactMessageRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Message deleted successfully", "Success"));
    }
}
