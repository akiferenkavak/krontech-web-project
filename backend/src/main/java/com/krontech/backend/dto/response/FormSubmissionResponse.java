package com.krontech.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record FormSubmissionResponse(
        UUID id,
        UUID formDefinitionId,
        String formName,
        Object data,
        String status,
        String ipAddress,
        boolean kvkkConsent,
        LocalDateTime createdAt
) {}
