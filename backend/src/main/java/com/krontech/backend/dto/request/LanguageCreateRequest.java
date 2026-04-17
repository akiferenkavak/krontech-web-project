package com.krontech.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LanguageCreateRequest(

        @NotBlank(message = "Dil kodu boş olamaz")
        @Size(min = 2, max = 10, message = "Dil kodu 2 ile 10 karakter arasında olmalıdır")
        String code,

        @NotBlank(message = "Dil adı boş olamaz")
        String name,

        boolean isDefault
) {
}