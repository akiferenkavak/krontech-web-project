package com.krontech.backend.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

public record FormSubmissionRequest(

        @NotNull(message = "Form ID boş olamaz")
        UUID formDefinitionId,

        // Gelen veriler esnek yapıda — frontend hangi alanları doldurduysa gönderir
        // Örn: {"name": "Ali Veli", "email": "ali@example.com", "company": "Kron"}
        @NotNull(message = "Form verisi boş olamaz")
        Map<String, Object> data,

        @AssertTrue(message = "KVKK onayı zorunludur")
        boolean kvkkConsent
) {}
