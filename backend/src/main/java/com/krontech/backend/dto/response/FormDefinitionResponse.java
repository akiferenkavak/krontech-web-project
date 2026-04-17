package com.krontech.backend.dto.response;

import java.util.UUID;

public record FormDefinitionResponse(
        UUID id,
        String name,
        String slug,
        Object fieldsSchema,
        boolean isActive,
        long newSubmissionCount
) {}
