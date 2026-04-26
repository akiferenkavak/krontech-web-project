package com.krontech.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecaptchaService {

    @Value("${recaptcha.secret-key}")
    private String secretKey;

    private static final String VERIFY_URL =
            "https://www.google.com/recaptcha/api/siteverify";

    private final RestTemplate restTemplate;

    /**
     * Google'a token'ı doğrulat.
     * @param token  Frontend'den gelen g-recaptcha-response değeri
     * @return true = geçerli, false = geçersiz / hata
     */
    public boolean verify(String token) {
        if (token == null || token.isBlank()) {
            log.warn("reCAPTCHA token boş geldi.");
            return false;
        }

        try {
            String url = VERIFY_URL + "?secret=" + secretKey + "&response=" + token;

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, null, Map.class);

            if (response == null) {
                log.warn("reCAPTCHA doğrulama yanıtı null döndü.");
                return false;
            }

            boolean success = Boolean.TRUE.equals(response.get("success"));
            if (!success) {
                log.warn("reCAPTCHA doğrulama başarısız. Hata kodları: {}", response.get("error-codes"));
            }
            return success;

        } catch (Exception e) {
            log.error("reCAPTCHA doğrulama sırasında hata oluştu: {}", e.getMessage());
            return false;
        }
    }
}