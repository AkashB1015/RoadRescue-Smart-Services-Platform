package com.smartemergency.config;

import com.smartemergency.entities.User;
import com.smartemergency.entities.Service;
import com.smartemergency.repository.UserRepository;
import com.smartemergency.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
	

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ServiceRepository serviceRepository,PasswordEncoder passwordEncoder) {
    	
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
        
    }

    @Override
    public void run(String... args) throws Exception {
    	
        seedUsers();
        seedServices();
        
    }

    private void seedUsers() {
    	
        if (!userRepository.existsByEmail("help.roadrescue@gmail.com")) {
        	
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("help.roadrescue@gmail.com");
            admin.setPhone("9999999999");
            admin.setRole("ADMIN");
            admin.setPasswordHash(passwordEncoder.encode("Admin@27"));
            userRepository.save(admin);
            System.out.println("Admin user seeded.");
            
        }

        if (!userRepository.existsByEmail("provider123@roadrescue.com")) {
        	
            User provider = new User();
            provider.setName("Ruttik");
            provider.setEmail("provider123@roadrescue.com");
            provider.setPhone("8888888888");
            provider.setRole("SERVICE_PROVIDER");
            provider.setPasswordHash(passwordEncoder.encode("Provider@27"));
            userRepository.save(provider);
            System.out.println("Service Provider user seeded.");
            
        }

        if (!userRepository.existsByEmail("user@roadrescue.com")) {
        	
            User user = new User();
            user.setName("Raj");
            user.setEmail("user@roadrescue.com");
            user.setPhone("7777777777");
            user.setRole("USER");
            user.setPasswordHash(passwordEncoder.encode("User@27"));
            userRepository.save(user);
            System.out.println("Regular user seeded.");
            
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
        	
            List<Service> services = Arrays.asList(
            		
                    createService("Flat Tyre Assistance",
                            "We handle puncture repairs, spare tyre changes, and air pressure checks for all vehicle types. Our mobile units are equipped with premium tools to ensure safety.",
                            "Starts at 300 rs", "bi-disc"),
                    createService("Engine Breakdown & Diagnostics",
                            "Advanced engine diagnostics and immediate fixes for cooling system failures, belt issues, and fluid leaks.",
                            "Starts at 1000 rs", "bi-tools"),
                    createService("EV Support & Charging",
                            "Portable charging for stranded EVs and specialized high-voltage system checks. We support Tesla, Nissan, and all major EV brands.",
                            "Starts at 500 rs", "bi-lightning-charge"),
                    createService("Battery Jumpstart",
                            "Dead battery? We provide improved jumpstart services or battery replacement on the spot.",
                            "Starts at 250 rs", "bi-battery-charging"),
                    createService("Lockout Service",
                            "Locked your keys inside? We provide non-destructive entry methods to retrieve your keys safely.",
                            "Starts at 250 rs", "bi-key"),
                    createService("Fuel Delivery",
                            "Ran out of gas? We deliver up to 2 liters of fuel to get you to the nearest station.",
                            "Starts at 200 rs", "bi-fuel-pump"));

            serviceRepository.saveAll(services);
            System.out.println("Default services seeded.");
            
        }
    }

    private Service createService(String title, String description, String price, String icon) {
    	
        Service service = new Service();
        service.setTitle(title);
        service.setDescription(description);
        service.setPrice(price);
        service.setIcon(icon);
        return service;
        
    }
}
