package com.hospital.service;

import com.hospital.dto.AuthDTO;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.entity.User;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        User savedUser = userRepository.save(user);

        Long profileId = null;

        if (request.getRole() == User.Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialization(request.getSpecialization());
            doctor.setQualification(request.getQualification());
            doctor.setYearsOfExperience(request.getYearsOfExperience());
            doctor.setConsultationFee(request.getConsultationFee());
            doctor.setAvailableDays(request.getAvailableDays());
            doctor.setAvailableTime(request.getAvailableTime());
            doctor.setPhoneNumber(request.getPhoneNumber());
            Doctor savedDoctor = doctorRepository.save(doctor);
            profileId = savedDoctor.getId();
        } else if (request.getRole() == User.Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setGender(request.getGender());
            patient.setBloodGroup(request.getBloodGroup());
            patient.setAddress(request.getAddress());
            patient.setPhoneNumber(request.getPhoneNumber());
            if (request.getDateOfBirth() != null) {
                patient.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
            }
            Patient savedPatient = patientRepository.save(patient);
            profileId = savedPatient.getId();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthDTO.AuthResponse(token, savedUser.getEmail(), savedUser.getName(),
                savedUser.getRole().name(), savedUser.getId(), profileId);
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        Long profileId = null;
        if (user.getRole() == User.Role.DOCTOR) {
            profileId = doctorRepository.findByUserId(user.getId()).map(Doctor::getId).orElse(null);
        } else if (user.getRole() == User.Role.PATIENT) {
            profileId = patientRepository.findByUserId(user.getId()).map(Patient::getId).orElse(null);
        }

        return new AuthDTO.AuthResponse(token, user.getEmail(), user.getName(),
                user.getRole().name(), user.getId(), profileId);
    }
}
