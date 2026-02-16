package com.smartemergency.exception_handler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.smartemergency.custom_exceptions.InvalidInputException;
import com.smartemergency.custom_exceptions.ResourceNotFoundException;
import com.smartemergency.custom_exceptions.AuthenticationException;
import com.smartemergency.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
		System.out.println("in resource not found exc ");
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(e.getMessage(), "Failed"));
	}
	
	@ExceptionHandler(InvalidInputException.class)
	public ResponseEntity<?> handleInvalidInputException(InvalidInputException e) {
		System.out.println("invalid input exc ");
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(e.getMessage(), "Failed"));
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
		System.out.println("authentication exc ");
		return ResponseEntity
				.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse(e.getMessage(), "Failed"));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e) {
		System.out.println("in catch-all ");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), "Failed"));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		System.out.println("in validation failure - req body ");
		List<FieldError> fieldErrors = e.getFieldErrors();
		Map<String, String> errorMap = fieldErrors.stream()
		.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(errorMap);
	}
}