package com.crms.controller;

import com.crms.dto.LoginRequest;
import com.crms.dto.LoginResponse;
import com.crms.dto.UserDTO;
import com.crms.domain.User;
import com.crms.repository.UserRepository;
import com.crms.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller for login and token management
 * Requirements: 8.1, 8.2, 15.1, 15.2
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication.getName());

        // Fetch user details
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        UserDTO userDTO = user != null ? new UserDTO(user) : null;

        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken, "Bearer", userDTO));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody String refreshToken) {
        if (tokenProvider.validateToken(refreshToken)) {
            String username = tokenProvider.getUsernameFromToken(refreshToken);
            String newAccessToken = tokenProvider.generateToken(username);
            String newRefreshToken = tokenProvider.generateRefreshToken(username);

            return ResponseEntity.ok(new LoginResponse(newAccessToken, newRefreshToken, "Bearer"));
        }

        return ResponseEntity.badRequest().build();
    }
}
