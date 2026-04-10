package com.hospital.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public GeminiService() {
        this.webClient = WebClient.builder().build();
    }

    public String analyzeSymptoms(String symptoms) {
        String prompt = """
                You are a medical assistant AI in a hospital management system.
                A patient is reporting the following symptoms: %s
                
                Please provide:
                1. Possible conditions these symptoms may indicate (3-4 possibilities)
                2. Recommended medical department to visit (e.g., Cardiology, Neurology, General Medicine, etc.)
                3. Urgency level: LOW / MEDIUM / HIGH
                4. General advice (do NOT provide specific medication or diagnosis)
                
                Format your response clearly with these 4 sections.
                Add a disclaimer that this is AI-generated guidance and not a medical diagnosis.
                Keep the response concise and easy to understand.
                """.formatted(symptoms);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        try {
            Map response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }
        } catch (Exception e) {
            return "AI service temporarily unavailable. Please consult with our medical staff directly. Error: " + e.getMessage();
        }

        return "Unable to analyze symptoms at this time. Please consult with a doctor.";
    }
}
