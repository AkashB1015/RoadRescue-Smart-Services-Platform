package com.smartemergency.service;

import com.smartemergency.entities.ContactMessage;
import java.util.List;

public interface ContactService {
    ContactMessage submitMessage(ContactMessage message);
    List<ContactMessage> getAllMessages();
    boolean markAsReviewed(Integer id);
}