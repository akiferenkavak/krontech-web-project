package com.krontech.backend.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

public record FormSubmissionRequest(

        @NotNull(message = "Form ID boş olamaz")
        UUID formDefinitionId,

        @NotNull(message = "Form verisi boş olamaz")
        Map<String, Object> data,

        // Zorunlu: kişisel verilerin işlenmesi ve 3. taraflara aktarım onayı
        @AssertTrue(message = "KVKK onayı zorunludur")
        boolean kvkkConsent,

        // Opsiyonel: SMS/e-posta ticari elektronik ileti onayı
        boolean marketingConsent,

        // reCAPTCHA v2 token — frontend'den gelir, backend Google'a doğrulatır
        @NotBlank(message = "reCAPTCHA doğrulaması zorunludur")
        String recaptchaToken
) {}