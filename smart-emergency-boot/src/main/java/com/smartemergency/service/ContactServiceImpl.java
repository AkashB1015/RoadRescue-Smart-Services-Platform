package com.smartemergency.service;

import com.smartemergency.entities.ContactMessage;
import com.smartemergency.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public ContactMessage submitMessage(ContactMessage message) {
        message.setStatus("Pending");
        return contactMessageRepository.save(message);
    }

    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    @Override
    public boolean markAsReviewed(Integer id) {
        return contactMessageRepository.findById(id).map(msg -> {
            msg.setStatus("Reviewed");
            contactMessageRepository.save(msg);
            return true;
        }).orElse(false);
    }
}