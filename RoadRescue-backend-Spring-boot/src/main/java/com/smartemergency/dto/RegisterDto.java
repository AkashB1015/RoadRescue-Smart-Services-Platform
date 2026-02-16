package com.smartemergency.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
	@NotBlank(message = "Name is required")
	@Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
	@Pattern(
	    regexp = "^[A-Za-z]+( [A-Za-z]+)*$",
	    message = "Name must contain letters only with single spaces between words"
	)
	private String name;



    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[1-9][0-9]{9}$", message = "Phone number must be exactly 10 digits and cannot start with 0.")
    private String phone;

    private String role = "USER";
}
