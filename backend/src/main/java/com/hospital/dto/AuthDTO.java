package com.hospital.dto;

import com.hospital.entity.User;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private User.Role role;
        // Doctor-specific
        private String specialization;
        private String qualification;
        private Integer yearsOfExperience;
        private Double consultationFee;
        private String availableDays;
        private String availableTime;
        // Patient-specific
        private String dateOfBirth;
        private String gender;
        private String bloodGroup;
        private String address;
        private String phoneNumber;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String role;
        private Long userId;
        private Long profileId;

        public AuthResponse(String token, String email, String name, String role, Long userId, Long profileId) {
            this.token = token;
            this.email = email;
            this.name = name;
            this.role = role;
            this.userId = userId;
            this.profileId = profileId;
        }
    }
}
