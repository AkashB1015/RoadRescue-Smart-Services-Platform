package com.smartemergency;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SmartEmergencyApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartEmergencyApplication.class, args);
	}

	@Bean
	public org.modelmapper.ModelMapper modelMapper() {
		
		return new org.modelmapper.ModelMapper();
		
	}
}
