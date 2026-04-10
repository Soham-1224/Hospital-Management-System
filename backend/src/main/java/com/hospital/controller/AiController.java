package com.hospital.controller;

import com.hospital.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/analyze-symptoms")
    public ResponseEntity<?> analyzeSymptoms(@RequestBody Map<String, String> request) {
        try {
            String symptoms = request.get("symptoms");
            if (symptoms == null || symptoms.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Symptoms cannot be empty");
            }
            String analysis = geminiService.analyzeSymptoms(symptoms);
            return ResponseEntity.ok(Map.of("analysis", analysis));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
