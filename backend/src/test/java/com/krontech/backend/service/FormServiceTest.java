package com.krontech.backend.service;

import com.krontech.backend.dto.request.FormSubmissionRequest;
import com.krontech.backend.dto.response.FormSubmissionResponse;
import com.krontech.backend.entity.FormDefinition;
import com.krontech.backend.entity.FormSubmission;
import com.krontech.backend.repository.FormDefinitionRepository;
import com.krontech.backend.repository.FormSubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Disabled(".")
@ExtendWith(MockitoExtension.class)
class FormServiceTest {

    @Mock
    private FormDefinitionRepository formDefinitionRepository;

    @Mock
    private FormSubmissionRepository formSubmissionRepository;

    @Mock
    private RecaptchaService recaptchaService;

    @InjectMocks
    private FormService formService;

    private UUID formId;
    private FormSubmissionRequest validRequest;
    private FormDefinition activeFormDefinition;

    @BeforeEach
    void setUp() {
        formId = UUID.randomUUID();
        
        // 1. Sahte Request Hazırla (Senin Record yapına uygun)
        validRequest = new FormSubmissionRequest(
                formId,
                Map.of("firstName", "Ahmet", "email", "ahmet@example.com"), // JSON Data
                true, // kvkkConsent
                false, // marketingConsent
                "valid-token" // recaptchaToken
        );

        // 2. Sahte Aktif Form Tanımı Hazırla
        activeFormDefinition = FormDefinition.builder()
                .id(formId)
                .name("Contact Form")
                .slug("contact")
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Başarılı Senaryo: reCAPTCHA ve Form geçerliyse gönderimi kaydetmeli")
    void shouldSubmitFormSuccessfully() {
        // GIVEN: Ön Koşullar
        when(recaptchaService.verify("valid-token")).thenReturn(true);
        when(formDefinitionRepository.findById(formId)).thenReturn(Optional.of(activeFormDefinition));

        // Kaydedilecek verinin nasıl döneceğini taklit ediyoruz
        FormSubmission savedSubmission = FormSubmission.builder()
                .id(UUID.randomUUID())
                .formDefinition(activeFormDefinition)
                .data(validRequest.data())
                .status("new")
                .ipAddress("127.0.0.1")
                .kvkkConsent(true)
                .marketingConsent(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        when(formSubmissionRepository.save(any(FormSubmission.class))).thenReturn(savedSubmission);

        // WHEN: Metodu Çağır
        FormSubmissionResponse response = formService.submitForm(validRequest, "127.0.0.1", "Mozilla/5.0");

        // THEN: Sonuçları Doğrula
        assertNotNull(response);
        assertEquals("new", response.status());
        assertEquals("Contact Form", response.formName());
        assertTrue(response.kvkkConsent());

        // Veritabanı kayıt metodunun gerçekten çağrıldığını teyit et
        verify(formSubmissionRepository, times(1)).save(any(FormSubmission.class));
    }

    @Test
    @DisplayName("Hata Senaryosu: reCAPTCHA geçersizse ResponseStatusException fırlatmalı")
    void shouldThrowExceptionWhenRecaptchaIsInvalid() {
        // GIVEN
        when(recaptchaService.verify("valid-token")).thenReturn(false);

        // WHEN & THEN
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            formService.submitForm(validRequest, "127.0.0.1", "Mozilla/5.0");
        });

        assertTrue(exception.getMessage().contains("reCAPTCHA doğrulaması başarısız"));
        
        // Veritabanına ASLA gidilmediğini (tasarruf) doğrula
        verify(formDefinitionRepository, never()).findById(any());
        verify(formSubmissionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Hata Senaryosu: Form pasifse IllegalStateException fırlatmalı")
    void shouldThrowExceptionWhenFormIsInactive() {
        // GIVEN
        FormDefinition inactiveForm = FormDefinition.builder()
                .id(formId)
                .isActive(false)
                .build();

        when(recaptchaService.verify("valid-token")).thenReturn(true);
        when(formDefinitionRepository.findById(formId)).thenReturn(Optional.of(inactiveForm));

        // WHEN & THEN
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            formService.submitForm(validRequest, "127.0.0.1", "Mozilla/5.0");
        });

        assertEquals("Bu form şu an aktif değil.", exception.getMessage());
        
        // Veritabanına kayıt işlemi YAKALANMAMALI
        verify(formSubmissionRepository, never()).save(any());
    }
}