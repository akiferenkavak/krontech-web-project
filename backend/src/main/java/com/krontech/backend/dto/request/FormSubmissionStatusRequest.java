package com.krontech.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record FormSubmissionStatusRequest(

        @NotBlank(message = "Durum boş olamaz")
        @Pattern(regexp = "new|read|exported", message = "Geçerli durumlar: new, read, exported")
        String status
) {}
