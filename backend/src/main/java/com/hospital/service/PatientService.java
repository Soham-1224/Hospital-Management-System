package com.hospital.service;

import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        if (updatedPatient.getPhoneNumber() != null)
            patient.setPhoneNumber(updatedPatient.getPhoneNumber());
        if (updatedPatient.getAddress() != null)
            patient.setAddress(updatedPatient.getAddress());
        if (updatedPatient.getBloodGroup() != null)
            patient.setBloodGroup(updatedPatient.getBloodGroup());
        if (updatedPatient.getEmergencyContact() != null)
            patient.setEmergencyContact(updatedPatient.getEmergencyContact());
        if (updatedPatient.getMedicalHistory() != null)
            patient.setMedicalHistory(updatedPatient.getMedicalHistory());
        return patientRepository.save(patient);
    }

    public long getTotalPatients() {
        return patientRepository.count();
    }
}
